// import { User, Role } from '../api/models';
// import Mixpanel from 'mixpanel';
// import logger from "./logger";
// import ENV from "../config/environments";
// import { TeamCaregivers, Teams, Organization } from '../api/models'; // Assuming these imports are required

// const mixpanelConfig = ENV.mixpanel;
// const mixpanel = Mixpanel.init(mixpanelConfig?.token);

// class AnalyticsService {

//     /**
//      * track analytics
//      * @param eventName event name
//      * @param eventData event data
//      * @param userId user id
//      * @returns {}
//      */
//     async track(eventName: string, eventData: any, userId: string): Promise<void> {
//         try {
//             if (!eventData) {
//                 eventData = {};
//             }

//             if (userId) {
//                 eventData.distinct_id = userId;
//             }
//             await mixpanel.track(eventName, eventData);
//         } catch (err) {
//             logger.log('error', `send mobile message: stacktrace :: ${err}`);
//             throw err;
//         }
//     }

//     /**
//      * Set user
//      * @param userId user id
//      * @param ip ip address
//      * @returns {}
//      */
//     async setUser(userId: string, ip?: string): Promise<void> {
//         try {
//             const user = await User.findOne({ where: { id: userId }, include: [{ model: Role }] });
//             if (user) {
//                 const params: any = {
//                     "$first_name": user.firstName,
//                     "$last_name": user.lastName,
//                     "$created": user.createdAt,
//                     "$email": user.email,
//                     "$phone": user.phone,
//                     "role": user.Roles,
//                     "assignedTeams": [],
//                     "assignedOrgs": [],
//                     "assignedTeamIDs": [],
//                     "assignedOrgIDs": [],
//                     "userTeamCount": 0,
//                     "userOrgCount": 0
//                 };
//                 if (ip) {
//                     params.ip = ip;
//                 }

//                 const usersTeam = await TeamCaregivers.findAll({ where: { UserId: userId }, include: { model: Teams } });

//                 params.userTeamCount = usersTeam.length;
//                 const orgIDs: string[] = [];
//                 await asyncForEach(usersTeam, async (team) => {
//                     params.assignedTeams.push(team.Team.name);
//                     params.assignedTeamIDs.push(team.Team.id);
//                     orgIDs.push(team.Team.OrganizationId);
//                 });
//                 const uniqueOrgIDs = Array.from(new Set(orgIDs));

//                 const organization = await Organization.findAll({ where: { id: uniqueOrgIDs } });
//                 params.userOrgCount = organization.length;
//                 await asyncForEach(organization, async (org) => {
//                     params.assignedOrgs.push(org.name);
//                     params.assignedOrgIDs.push(org.id);
//                 });

//                 mixpanel.people.set(user.id.toString(), params);
//             }
//         } catch (err) {
//             logger.log('error', `send mobile message: stacktrace :: ${err}`);
//             throw err;
//         }
//     }
// }

// export = AnalyticsService;

// async function asyncForEach(array: any[], callback: (item: any, index: number, array: any[]) => Promise<void>): Promise<void> {
//     for (let index = 0; index < array.length; index++) {
//         await callback(array[index], index, array);
//     }
// }
