import { EventEmitter } from 'events';
import { User } from '../../api/models';

export class UserEventEmitter extends EventEmitter {
    constructor() {
        super();
    }

    // Method to emit the user created event
    emitUserCreated(user: User) {
        this.emit('userCreated', user);
    }

    // Method to emit the user deleted event
    emitUserDeleted(userId: string) {
        this.emit('userDeleted', userId);
    }
}
