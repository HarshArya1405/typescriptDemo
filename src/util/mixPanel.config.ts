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
    'role'?: string;
    'ip'?: string;
}

interface EventData {
    [key: string]: string | number | boolean;
}

class AnalyticsService {

    /**
     * track analytics
     * @param eventName event name
     * @param eventData event data
     * @param userId user id
     * @returns {}
     */
    async track(eventName: string, eventData: EventData, userId: string): Promise<void> {
        try {
            if (!eventData) {
                eventData = {};
            }

            if (userId) {
                eventData.distinct_id = userId;
            }
            mixpanel.track(eventName, eventData);
        } catch (err) {
            logger.log('error', 'send mobile message: stacktrace :: ${err}');
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
            const user = await userRepository.findOne({ where: { id: userId }});
            if (user) {
                const params: MixpanelUserParams = {
                    '$first_name': user.fullName,
                    '$email': user.email,
                    '$phone': user.phone,
                    'role': user.role,
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
