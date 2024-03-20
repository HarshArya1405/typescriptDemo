import { YoutubeUserToken,YoutubeDraft } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import logger from '../../../util/logger';
import { YTconnection } from '../../../util/YTconnection.config';
import { FindManyOptions, Like } from 'typeorm';

// Get repository
const YoutubeDraftRepository = AppDataSource.getRepository(YoutubeDraft);
const youtubeUserTokenRepository = AppDataSource.getRepository(YoutubeUserToken);
const yTconnection = new YTconnection();

interface Token {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number; // Assuming it's a number, adjust as needed
}
interface YouTubeItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      standard: {
        url: string;
      };
    };
    resourceId: {
      videoId: string;
    };
  };
}
// Service class for Youtube
export class YoutubeService {

  // Method to getAuthUrl a new Youtube
  public async getAuthUrl(): Promise<object> {
    try {
      const url: string = await yTconnection.authorizeUrl();
      return { url };
    } catch (error) {
      logger.error(`[YoutubeService][getAuthUrl] - Error : ${error}`);
      throw error;
    }
  }

  // Method to generateToken Youtubes with optional name filter
  public async generateToken(userId: string, code: string): Promise<object> {
    try {
      const token: string | undefined = await yTconnection.getNewToken(code);
      if (token) {
        const savedToken:YoutubeUserToken = await this.saveToken(token, userId);

        const result:{playlistId?:string,playlists?:{items:YouTubeItem[]}} = await this.fetchChannelPlaylist(token);
        logger.info(`[YoutubeService][generateToken] Playlist   - ${JSON.stringify(result)}`);
        if(result.playlistId){
          // checking if playlistId already exist for same user, then updating old one
          const configExist = await youtubeUserTokenRepository.findOne({
            where:{userId : userId,playlistId:result.playlistId}
          });
          if(configExist){
            await youtubeUserTokenRepository.delete(savedToken.id);
            configExist.token = token;
            await youtubeUserTokenRepository.save(configExist);
          }else{
            savedToken.playlistId = result.playlistId;
            await youtubeUserTokenRepository.save(savedToken);
          }
        }
        if(result.playlists){
          await this.saveDraftItems(result.playlists.items,userId);
        }
        return { success: true, token };
      }
      return { success: true, token };
    } catch (error) {
      logger.error(`[YoutubeService][generateToken] - Error : ${error}`);
      throw error;
    }
  }

  // Method to fetch and dump Youtube data from an external API
  public async fetchChannelPlaylist(token: string): Promise<object> {
    const userToken = await youtubeUserTokenRepository.findOne({
      where: { token }
    });
  
    if (userToken?.access_token) {
      try {
        const data : {contentDetails:{relatedPlaylists:{uploads:string}}}= await new Promise((resolve, reject) => {
          yTconnection.getChannel(userToken.token, (error, data) => {
            if (error) {
              logger.error(`[YoutubeService][fetchChannelPlaylistData] - Error : ${error}`);
              reject(error); // Reject the promise with the error
            } else {
              resolve(data); // Resolve the promise with the data
            }
          }); 
        });
        logger.info(`[YoutubeService][fetchChannelPlaylist] channelData   - ${JSON.stringify(data)}`);

        const playlistId:string = data.contentDetails.relatedPlaylists.uploads;
        const playlists :object = await yTconnection.getPlaylistItems(playlistId,userToken.access_token);

        return {playlists,playlistId};
      } catch (error) {
        logger.error(`[YoutubeService][fetchChannelPlaylistData] - Error : ${error}`);
        throw error; // Throw the error if an exception occurs
      }
    }
  
    return { success: false };
  }


  // Method to fetch and dump Youtube data from an external API
  public async saveToken(tokenCode: string, userId: string): Promise<YoutubeUserToken> {
    try {
      const token: Token | undefined = JSON.parse(tokenCode) as Token;
      const youtubeUserToken = new YoutubeUserToken();
      youtubeUserToken.userId = userId;
      youtubeUserToken.token = tokenCode;
      youtubeUserToken.access_token = token.access_token;
      youtubeUserToken.refresh_token = token?.refresh_token ?? 'NA';
      youtubeUserToken.scope = token.scope;
      youtubeUserToken.token_type = token.token_type;
      youtubeUserToken.expiry_date = token.expiry_date;
      await youtubeUserTokenRepository.save(youtubeUserToken);
      return youtubeUserToken;
    } catch (error) {
      logger.error(`[YoutubeService][fetchChannelPlaylistData] - Error : ${error}`);
      throw error;
    }
  }

    // Method to dump Yt content as a draft
  public async saveDraftItems(items:YouTubeItem[], userId: string):Promise<object>{
    try {
      if(items && items.length >0){
        for(const item of items){
          const youtubeDraftExist = await YoutubeDraftRepository.findOne({where:{userId,url:item.snippet.resourceId.videoId}});
          if(!youtubeDraftExist){
            const youtubeDraft = new YoutubeDraft();
            youtubeDraft.userId = userId;
            youtubeDraft.title = item.snippet.title;
            youtubeDraft.description = item.snippet.description;
            youtubeDraft.publishedAt = item.snippet.publishedAt;
            youtubeDraft.thumbnail = item.snippet.thumbnails.standard.url;
            youtubeDraft.url = item.snippet.resourceId.videoId;
            await YoutubeDraftRepository.save(youtubeDraft);
          }
        }
      }
      return {success:true};
    } catch (error) {
      logger.error(`[YoutubeService][draftList] - Error : ${error}`); 
      throw error;
    }
  }
  // Method to draftList an existing Youtube
  public async draftList(userId: string,query: { offset: number, limit: number,  title: string }): Promise<object>{
    try {
      const options: FindManyOptions<YoutubeDraft> = {
        skip: query.offset,
        take: query.limit,
        where: {userId},
      };
      if (query.title) {
        options.where = { title: Like(`%${query.title}%`) };
      }

      const [data, count] = await YoutubeDraftRepository.findAndCount(options);
      return { count, data };
    } catch (error) {
      logger.error(`[YoutubeService][draftList] - Error : ${error}`);
      throw error;
    }
  }
}
