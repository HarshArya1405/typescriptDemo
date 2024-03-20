// listener.ts

import { User } from '../../api/models';
import { UserEventEmitter } from '../EventEmitters';

const userEventEmitter = new UserEventEmitter();

// Listener for the userCreated event
userEventEmitter.on('userCreated', (user: User) => {

    /**
     * mixpanel user save
     * wallet create if required
     * if(data.sub){
     * walletservice.createFromSub()
     * }
     * roles add
     */
    console.log('User created:', user);
    // Add logic to send email to the user, set role, etc.
});

// Listener for the userDeleted event
userEventEmitter.on('userDeleted', (userId: string) => {
    /**
     * Leraner -
     * roles
     * tags
     * protocols
     * wallets
     * 
     * Creator -
     * roles
     * contents(video,text,Quiz,Course)
     * ytDraft video
     * 
     */
    console.log(`User deleted with ID: ${userId}`);
    // Add logic to handle user deletion
});
