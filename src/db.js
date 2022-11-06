import { UserDoesNotExistError, UserAlreadyExistsError } from './db/error.js'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Configure lowdb to write to JSONFile
const adapter = new JSONFile("db.json"); // project root
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();
db.data ||= { chats: {} };

export * from './db/error.js'

export async function register_user(id, chat, name) {
    try {
        if (get_user(id, chat)) {
            throw new UserAlreadyExistsError(id)
        }
    } catch (e) {
        if (!(e instanceof UserDoesNotExistError)) {
            throw e;
        }
    }
    
    db.data.chats[chat] ||= { users: [] };
    db.data.chats[chat].users.push({id: id, name: name, size: 0, last_grew_up: 0 });

    await db.write();
}

export function get_user(id, chat) {
    let user = db.data.chats[chat]?.users?.find(user => user.id === id);

    if (user === -1 || user === undefined) {
        throw new UserDoesNotExistError(id);
    }

    return user;
}

export async function resize_dick(id, chat, size) {
    let user = get_user(id, chat);

    user.size += size;

    await db.write();
}

export async function update_last_grew_up(id, chat, timestamp) {
    let user = get_user(id, chat);

    user.last_grew_up = timestamp;

    await db.write()
}

export function get_position(id, chat) {
    let users = db.data.chats[chat]?.users;

    if (users === undefined) {
        throw new UserDoesNotExistError(id)
    }
    
    users.sort((a, b) => a.size > b.size ? 1 : -1);

    let position = users.findIndex(user => user.id === id);

    if (position === -1) {
        throw new UserDoesNotExistError(id);
    }

    return position + 1;
}
