// listener.ts

import { User } from '../../api/models';
import { UserEventEmitter } from '../EventEmitters';

const userEventEmitter = new UserEventEmitter();

// Listener for the userCreated event
userEventEmitter.on('userCreated', (user: User) => {
    console.log('User created:', user);
    // Add logic to send email to the user, set role, etc.
});

// Listener for the userDeleted event
userEventEmitter.on('userDeleted', (userId: string) => {
    console.log(`User deleted with ID: ${userId}`);
    // Add logic to handle user deletion
});
