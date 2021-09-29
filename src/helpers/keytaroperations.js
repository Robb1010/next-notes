// Keytar is the current solution for saving user credentials, but it is not ideal
// When introducing local encrypted storage of notes, keytar should be replaced with locally encrypted credentials

import keytar from 'keytar';

class Keytar {
    async findAll() {
        return await keytar.findCredentials("nextNotes");
    }

    async setPassword(user, password) {
        await keytar.setPassword("nextNotes", user, password);
    }

    async deleteAccount(account) {
        return await keytar.deletePassword("nextNotes", account);
    }
}

export default Keytar;



