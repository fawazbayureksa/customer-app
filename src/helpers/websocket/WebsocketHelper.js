import { createContext } from "react";

export const WebsocketPayloadType = {
    MessageData: "message_data",
	MessageError: "message_error",
	MessageGetMore: "message_get_more",
	MessageRead: "message_read",
	MessageNewChatroom: "message_new_chatroom",
	MessageGetChatrooms: "message_get_chatrooms",
	MessageGetChatroom: "message_get_chatroom"
}

export const ChatMessageType = {
    Text: 'text',
    Product: 'product',
    Attachment: 'attachment',
}

// export const WebsocketContext = createContext({
// 	status: {
// 		name: '',
// 		color: ''
// 	},
// 	payload: null,
// 	ws: null,
// 	unread: 0,
// 	changeContext: ()=>{},
// });

export const WebsocketContext = createContext(
	false,
	() => { },
	{
		name: '',
		color: ''
	},
	null,
	null,
	0,
	() => { }
);