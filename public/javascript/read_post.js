var firebaseConfig = {
    apiKey: "AIzaSyBriqW5bb956O8Mi87iZJKtdNsD4uWGBp4",
    authDomain: "lecture-story.firebaseapp.com",
    databaseURL: "https://lecture-story.firebaseio.com",
    projectId: "lecture-story",
    storageBucket: "lecture-story.appspot.com",
    messagingSenderId: "109177070261",
    appId: "1:109177070261:web:8b6aa71008757f550254fc"
};
  firebase.initializeApp(firebaseConfig);
  
  const db=firebase.firestore();
  //db.settings({timestamsInSnapshots:true});
  
  // 로그아웃 함수
  function logOut(){
      firebase.auth().signOut().then(function() {
          // Sign-out successful.
          window.location.href="login.html";
      }).catch(function(error) {
          // An error happened.
      });
  }
  
  // 렉쳐정보 전달 받기
  const courseNO=localStorage.getItem("courseNO");
  const courseName=localStorage.getItem("courseName");
  const prof=localStorage.getItem("prof");
  var semester=localStorage.getItem("semester");
  var doc_id = localStorage.getItem("docID");
  
  // 렉처 이름 띄우기
  document.getElementById("subject").innerHTML=courseName+"-"+prof;
  
  // 학기 select box의 디폴트 값을 현재 학기로 설정
  var semester_value = semester.substring(0, 6);
  var select_tag = document.getElementById(semester_value);
  select_tag.setAttribute("selected", "selected");
  
  var postingZone = document.querySelector(".content");
  postingZone.innerHTML="";
  var commentZone;

  // 넘겨받은 문서 id 사용해서 문서 불러오고 화면에 띄우기
  var docRef = db.collection(semester).doc(courseNO+"-"+prof).collection("board").doc(doc_id)
  docRef.get().then((doc)=>{
    addPostHTML(doc);

    var commentUl = document.createElement("ul");
    commentUl.setAttribute("class", "comments");
    postingZone.append(commentUl);
    commentZone = document.querySelector(".comments");

    var commentRef = docRef.collection("comment");
    commentRef.orderBy("time")
    .get().then((querySnapshot) => {
        querySnapshot.forEach((comment_doc) => {
          addCommentHTML(comment_doc);
        });
    });

    addWriteSecHTML();
  });
  
  // 해당 게시글 본문을 화면에 띄우는 함수
  function addPostHTML(doc){
    var entry = document.createElement("div");
    entry.setAttribute("class","origin_post");

    var content = document.createElement("span");
    content.setAttribute("class","contents");
    content.innerText = doc.data().content;

    var edit_button = document.createElement("span");
    edit_button.setAttribute("class","edit_button");

    var edit = document.createElement("button");
    edit.setAttribute("type","button");
    edit.innerText = "수정";

    var del = document.createElement("button");
    del.setAttribute("type","button");
    del.setAttribute("onclick", "del_post()");
    del.innerText = "삭제";
    
    var date_div = document.createElement("div");

    var date = document.createElement("p");
    date.setAttribute("class", "date");
    date.innerText= doc.data().time.toDate().toDateString();

    var like_com = document.createElement("span");
    like_com.setAttribute("class","like-comment");

    var like = document.createElement("img");
    like.setAttribute("src", "../imgs/like.png");

    var like_num = document.createElement("span");
    var like_num_node = document.createTextNode(doc.data().like);
    like_num.append(like_num_node);

    var comment = document.createElement("img");
    comment.setAttribute("src", "../imgs/comment.png");

    var comment_num = document.createElement("span");
    var comment_num_node = document.createTextNode(doc.data().commentNum);
    comment_num.append(comment_num_node);
    
    like_com.append(like);
    like_com.append(like_num);
    like_com.append(comment);
    like_com.append(comment_num);
    date.append(like_com);
    edit_button.append(edit);
    edit_button.append(del);
    date_div.append(date);
    entry.append(content);
    if(firebase.auth().currentUser.uid == doc.data().userId){
        entry.append(edit_button);
    }
    entry.append(date_div);

    postingZone.appendChild(entry);
}

// 게시글의 댓글을 화면에 띄우는 함수
function addCommentHTML(doc){
    var entry = document.createElement("li");

    var comment = document.createElement("div");
    comment.setAttribute("class","post");

    var contents = document.createElement("span");
    contents.setAttribute("class","contents");
    var contents_text = document.createTextNode(doc.data().content);
    contents.append(contents_text);

    var edit_button = document.createElement("span");
    edit_button.setAttribute("class","edit_button");

    var edit = document.createElement("button");
    edit.setAttribute("type","button");
    edit.innerText = "수정";

    var del = document.createElement("button");
    del.setAttribute("type","button");
    del.setAttribute("data-docid", doc.id);
    del.setAttribute("onclick", "del_comment(this.dataset.docid)");
    del.innerText = "삭제";

    var date_div = document.createElement("div");

    var date = document.createElement("p");
    date.setAttribute("class", "date");
    date.innerText= doc.data().time.toDate().toDateString();
    
    date_div.append(date);
    edit_button.append(edit);
    edit_button.append(del);
    comment.append(contents);
    if(firebase.auth().currentUser.uid == doc.data().userId){
        comment.append(edit_button);
    }
    comment.append(date_div);
    entry.append(comment);

    commentZone.appendChild(entry);
}

// 댓글 작성창을 화면에 띄우는 함수
function addWriteSecHTML(){
    var entry = document.createElement("div");
    entry.setAttribute("class", "write_comment");

    var form = document.createElement("form");
    form.setAttribute("method","post");

    var textarea = document.createElement("textarea");
    var input = document.createElement("input");
    input.setAttribute("class", "button");
    input.setAttribute("type", "submit");
    input.setAttribute("value", "등 록");

    form.append(textarea);
    form.append(input);
    entry.append(form);

    postingZone.appendChild(entry);
}

function del_post(){
    docRef.delete().then(
        function(){
            alert("삭제되었습니다.");
            window.location.href="timeline.html";
        });
}

function del_comment(doc_name){
    console.log(doc_name);
    docRef.collection("comment").doc(doc_name).delete().then(
            function(){
                alert("삭제되었습니다.");
                window.location.reload();
            });
}