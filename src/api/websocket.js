import SockJS from  'sockjs-client';
import Stomp from 'stompjs';
let stompClient;
let selectedUserOrGrup="10000000000000000";
let newMessages = new Map();

export const connect = (uId) => {
            let socket = new SockJS('http://localhost:8088' + '/ws');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/messages/' + uId , function (res) {
                    let data = JSON.parse(res.body);
                    // 执行操作
                    console.log("收到消息了！！！", data);
                });
            })
        }

export const disconnect = () => {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            console.log("Disconnected");    
        }

export const sendMessage = (from, to, text) => {
            stompClient.send("/app/chat/" + to, {}, JSON.stringify({
                fromLogin: from,
                message : text
            }));
        }
