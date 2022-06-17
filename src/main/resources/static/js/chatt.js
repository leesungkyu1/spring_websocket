const ws = new WebSocket("ws://" + location.host + "/chat");
ws.onopen=()=>{
    chat.chatOpen();
}

ws.onclose=()=>{
    let reqData = JSON.parse(sessionStorage.getItem("chatInfo"));
    reqData.type="LEAVE"
    //작업 필요
}

const chat ={
    init:(type, url)=>{
        switch (type){
            case "new"
                : chat.roomMake();
                break;
            case "chat"
                :
                let roomId = url.split("/")[url.split("/").length-1];
                sessionStorage.setItem("roomId", roomId);
                let user = JSON.parse(sessionStorage.getItem("userKey"));
                let {userKey, id} = user;
                getId("mid").value = id;
                getId("mid").setAttribute("data-userkey", userKey);
                chat.chatOpen();
                break;
            case "list"
            : chat.chatList();
                break;
            default :
                alert("새로고침후 다시 시도해주세요");
                break;
        }
    },

    reqFileObjCreate:(msg, type, file)=>{
        let fileReader = new FileReader();
        fileReader.onload=()=>{
            console.log(file);
            let data ={};
            data.id = getId('mid').value;
            data.chatRoomId = sessionStorage.getItem("roomId");
            data.userKey = getId('mid').getAttribute("data-userkey");
            data.file = file;
            data.type = type;
            data.message = msg;
            data.date = new Date().toLocaleString();
            let temp = JSON.stringify(data);
            ws.send(temp);
            arrayBuffer = fileReader.result;
            console.log(arrayBuffer);
            ws.send(arrayBuffer); //파일 소켓 전송
        }
        fileReader.readAsArrayBuffer(file);
    },


    reqObjCreate:(msg, type)=>{
        let data ={};
        data.id = getId('mid').value;
        data.chatRoomId = sessionStorage.getItem("roomId");
        data.userKey = getId('mid').getAttribute("data-userkey");
        data.type = type;
        data.message = msg;
        data.date = new Date().toLocaleString();
        let temp = JSON.stringify(data);
        return temp;
    },

    chatList:async()=>{
        // if(ws.onopen){
        //     chat.chatClose();
        // }
       let data = await getReq("/chat");
       let chatListContainer = getId("chatListContainer");
       data.forEach(el => {
            let{name, roomId} = el;
            let tr = document.createElement("tr");
            let roomIdTd = tagCreater("td", roomId);
            let nameTd = tagCreater("td", name);
            let btnTd = tagCreater("td");
            let inputBtn = tagCreater("a", "입장하기", "btn");


            inputBtn.classList.add("btn-primary");
            inputBtn.href=`/chat/${roomId}`;

            btnTd.appendChild(inputBtn);
            tr.appendChild(roomIdTd);
            tr.appendChild(nameTd);
            tr.appendChild(btnTd);
            chatListContainer.appendChild(tr);
       })
    },

    roomMake:()=>{
        console.log("room Make!!!");
    },

    chatOpen:()=>{
        ws.onopen=()=>{
            let reqData = chat.reqObjCreate("","ENTER");
            sessionStorage.setItem("chatInfo", reqData);
            ws.send(reqData);
            chat.chatt();
        }
    },

    chatt:()=>{
        let talk = getId('talk');
        let msg = getId("msg");
        let btnSend = getId("btnSend");
        let mid = getId("mid");
        ws.onmessage = function(msg){
            let data = JSON.parse(msg.data);
            console.log(data);
            let css;
            if(data.id === mid.value){
                css = 'class=me';
            }else{
                css = 'class=other';
            }

            let item = `<div ${css} >
		                <span><b>${data.id}</b></span><br/>
                      <span>${data.message}</span>
						</div>`;

            talk.innerHTML += item;
            talk.scrollTop=talk.scrollHeight;//스크롤바 하단으로 이동
        }

        msg.onkeyup = function(ev){
            if(ev.keyCode == 13){
                chat.send(msg);
            }
        }

        btnSend.onclick = function(){
            chat.send(msg);
        }
    },

    send:(msg)=>{
        if(msg.value.trim() != ''){
            let file = document.querySelector("#fileSelect").files[0];
            console.log(file);
            chat.reqFileObjCreate(msg.value,"CHAT", file);
        }
        msg.value ='';
    },

    // send:(msg)=>{
    //     if(msg.value.trim() != ''){
    //         let file = document.querySelector("#fileSelect").files[0];
    //         let reqData = chat.reqObjCreate(msg.value,"CHAT", file);
    //         ws.send(reqData);
    //     }
    //     msg.value ='';
    // },
}


