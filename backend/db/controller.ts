import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { User, Resource, Booking, BookingStatus, UserRole } from '../../types';
import { INITIAL_RESOURCES } from '../../constants';

// AWS SDK Client Configuration
const client = new DynamoDBClient({ 
    region: "us-east-1" // Apna region check kar lein
});
const docClient = DynamoDBDocumentClient.from(client);

class DBController {
  // USERS
  async findUserByEmail(email: string) {
    const res = await docClient.send(new GetCommand({ TableName: "Users", Key: { email } }));
    return res.Item as User;
  }
  
  async createUser(user: User, pass: string) {
    await docClient.send(new PutCommand({ 
        TableName: "Users", 
        Item: { ...user, password: pass } 
    }));
    return user;
  }
  async getUserPassword(email: string) {
    const res = await docClient.send(new GetCommand({ 
        TableName: "Users", 
        Key: { email } 
    }));
    return res.Item ? res.Item.password : null;
  }

  // RESOURCES
  async getResources() {
    const res = await docClient.send(new ScanCommand({ TableName: "Resources" }));
    
    if (!res.Items || res.Items.length === 0) {
      console.log("DynamoDB is empty. Uploading initial resources...");
      
      for (const item of INITIAL_RESOURCES) {
        await docClient.send(new PutCommand({
          TableName: "Resources",
          Item: item
        }));
      }
      
      const freshRes = await docClient.send(new ScanCommand({ TableName: "Resources" }));
      return freshRes.Items as Resource[];
    }

    return res.Items as Resource[];

  }
  async getResourceById(id: string) {
    const res = await docClient.send(new GetCommand({ 
        TableName: "Resources", 
        Key: { id } 
    }));
    return res.Item as Resource;
  }
  
  async addResource(resource: Omit<Resource, 'id'>) {
    const newResource = {
      ...resource,
      id: `res-${Date.now()}`, // Nayi unique ID generate karein
      status: 'AVAILABLE'
    };
    
    await docClient.send(new PutCommand({
      TableName: "Resources",
      Item: newResource
    }));
    
    return newResource;
  }

  async deleteResource(id: string) {
    await docClient.send(new DeleteCommand({
      TableName: "Resources",
      Key: { id: id } // Yahan ensure karein ke 'id' wahi hai jo table ki Partition Key hai
    }));
    return { success: true };
  }


  // BOOKINGS
  async createBooking(booking: Booking) {
    await docClient.send(new PutCommand({ TableName: "Bookings", Item: booking }));
    return booking;
  }

  async getBookings() {
    const res = await docClient.send(new ScanCommand({ TableName: "Bookings" }));
    return res.Items as Booking[];
  }

  async updateBookingStatus(id: string, status: BookingStatus) {
    await docClient.send(new UpdateCommand({
      TableName: "Bookings",
      Key: { id: id },
      UpdateExpression: "set #s = :status",
      ExpressionAttributeNames: {
        "#s": "status"
      },
      ExpressionAttributeValues: {
        ":status": status
      }
    }));
    return { success: true };
  }
}

export const db = new DBController();
