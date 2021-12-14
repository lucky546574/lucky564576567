
const qrcode = require('qrcode-terminal');

const { Client, Location, List, Buttons,MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    session: sessionData
});




//client.on('qr', qr => {
 //   qrcode.generate(qr, {small: true});
//});

//client.on('ready', () => {
 //   console.log('Client is ready!');
//});


//client.on('message', message => {
//	if(message.body === 'helo') {
//		message.reply('how are you');
//	}
	
//});

// Save session values to the file upon successful auth
//client.on('authenticated', (session) => {
 //   sessionData = session;
 //   fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
//        if (err) {
 //           console.error(err);
 //       }
 //   });
//});

// Notificatons..........................................
client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    console.log('join', notification);
    notification.reply('User joined.');
});
client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    console.log('leave', notification);
    notification.reply('User left.');
});

//send Media from local
client.on('message', message => {
	if(message.body === 'hy') {
		
        message.reply(MessageMedia.fromFilePath('C:/Users/Ahmad Hassan/Desktop/whatsapp/1.pdf'));
	}
});



client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);

	if (msg.body === '!ping reply') {
        // Send a new message as a reply to the current one
        msg.reply('pong');

    } 
	else if (msg.body === '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong');
    }
//owner
	else if (msg.body === '.owner') {
		let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
*Name*: Ahmad Hassan  
*Phone No*: ${chat.owner.user}    `);
        } else {
            msg.reply('This command can only be used in a group!');
        }        
    }

	else if (msg.body === 'pdf') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, MessageMedia.fromFilePath('C:/Users/Ahmad Hassan/Desktop/whatsapp/1.pdf'));
		msg.reply(MessageMedia.fromFilePath('C:/Users/Ahmad Hassan/Desktop/whatsapp/1.pdf'));

    }
     // Change the group description
	 else if (msg.body.startsWith('!desc')) {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            let newDescription = msg.body.slice(6);
            chat.setDescription(newDescription);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    }

	else if (msg.body === '!leave') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            chat.leave();
        } else {
            msg.reply('This command can only be used in a group!');
        }
    }
	
     //groupinfo
	else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            msg.reply('This command can only be used in a group!');
        }
    }
     //buttons
	else if (msg.body === '!buttons') {
        let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        client.sendMessage(msg.from, button);
    }

	else if (msg.body === '!resendmedia' && msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const attachmentData = await quotedMsg.downloadMedia();
            client.sendMessage(msg.from, attachmentData, { caption: 'Here\'s your requested media.' });
        }
    }


	

	





});










client.initialize();


