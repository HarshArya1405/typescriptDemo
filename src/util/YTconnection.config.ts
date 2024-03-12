import { google, Auth } from 'googleapis';
import axios from 'axios';
import ENV from '../config/environments';

interface OAuth2Client extends Auth.OAuth2Client {}

const SCOPES: string[] = ['https://www.googleapis.com/auth/youtube.readonly'];

export class YTconnection {

  public async authorizeUrl(): Promise<string> {
    // Check if client secrets are loaded before using them
    if (!ENV.YTConfig) {
      console.log('Client secrets not loaded.');
      return '';
    }
    const { client_secret, client_id, redirect_uris } = ENV.YTConfig;
    const oauth2Client: OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl: string = oauth2Client.generateAuthUrl({ access_type: 'offline',approval_promt:'force', scope: SCOPES[0] });
    console.log('Authorize this app by visiting this url: ', authUrl);
    return authUrl;
  }

  public async getNewToken(code:string): Promise<string | undefined> {
    if (!ENV.YTConfig) {
      console.log('Client secrets not loaded.');
      return undefined;
    }
    const { client_secret, client_id, redirect_uris } = ENV.YTConfig;
    const oauth2Client: OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const tokenResponse = await new Promise<any>((resolve, reject) => {
      oauth2Client.getToken(decodeURIComponent(code), (err: any, token: any) => {
        if (err) {
          reject(err); // Reject the promise if there's an error
        } else {
          resolve(token); // Resolve the promise with the token if successful
        }
      });
    });
    return JSON.stringify(tokenResponse);
  }

  public async getChannel(token: string, callback: (error: any, data: any) => void): Promise<void> {
    if (!ENV.YTConfig) {
      console.log('Client secrets not loaded.');
      return undefined;
    }
    const { client_secret, client_id, redirect_uris } = ENV.YTConfig;
    const oauth2Client: OAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oauth2Client.credentials = JSON.parse(token);
  
    const service: any = google.youtube('v3');
    service.channels.list({
      auth: oauth2Client,
      part: 'snippet,contentDetails,statistics',
      // forUsername: 'GoogleDevelopers',
      mine:true
    }, (err: any, response: any) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        callback(err, null); // Pass error to the callback
      } else {
        const channels: any[] = response.data.items;
        if (channels.length == 0) {
          console.log('No channel found.');
        } else {
          console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
            'it has %s views.',
            channels[0].id,
            channels[0].snippet.title,
            channels[0].statistics.viewCount);
        }
        callback(null, channels[0]); // Pass response data to the callback
      }
    });
  }

  public async getPlaylistItems(playlistId:string,token: string): Promise<object>{
    if (!ENV.YTConfig) {
      console.log('Client secrets not loaded.');
      return {};
    }
    const {api_key} = ENV.YTConfig;
    const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2Cid%2Csnippet&playlistId=${playlistId}&key=${api_key}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };
  
    try {
      const response = await axios.get(url, { headers });
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  
  }  
}
