import { User } from '../api/models';
import Mixpanel from 'mixpanel';
import logger from './logger';
import ENV from '../config/environments';
import { AppDataSource } from '../loaders/typeormLoader';


const userRepository = AppDataSource.getRepository(User);

const mixpanelConfig = ENV.mixpanel;
const mixpanelToken = mixpanelConfig?.token || ''; // Provide a default empty string if mixpanelConfig?.token is undefined
const mixpanel = Mixpanel.init(mixpanelToken);


interface MixpanelUserParams {
    '$first_name'?: string;
    '$email'?: string;
    '$phone'?: string;
    'roles'?: object[];
    'ip'?: string;
}

class AnalyticsService {

    /**
     * track analytics
     * @param eventName event name
     * @param eventData event data
     * @param userId user id
     * @returns {}
     */
    async track(eventName: string, eventData: string, userId: string): Promise<void> {
        try {
            if (!eventData) {
                eventData = JSON.stringify({});
            }
    
            if (userId) {
                const parsedEventData: { [key: string]: string } = JSON.parse(eventData);
                parsedEventData.distinct_id = userId;
                eventData = JSON.stringify(parsedEventData);
            }
            mixpanel.track(eventName, JSON.parse(eventData));
        } catch (err) {
            logger.log('error', `send mobile message: stacktrace :: ${err}`);
            throw err;
        }
    }
    

    /**
     * Set user
     * @param userId user id
     * @param ip ip address
     * @returns {}
     */
    async setUser(userId: string, ip?: string): Promise<void> {
        try {
            const user = await userRepository.findOne({ where: { id: userId },relations:['roles']});
            if (user) {
                const params: MixpanelUserParams = {
                    '$first_name': user.fullName,
                    '$email': user.email,
                    '$phone': user.phone,
                    'roles': user.roles,
                };
                if (ip) {
                    params.ip = ip;
                }
                mixpanel.people.set(user.id, params);
            }
        } catch (err) {
            logger.log('error', 'setUser: ${err}');
            throw err;
        }
    }
    
}

export = AnalyticsService;
