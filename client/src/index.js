import { useContext, useEffect, useRef, useState } from 'react'; // it's not important after react 17 
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import { format } from "timeago.js";
import { useParams, useNavigate } from 'react-router';
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import { CircularProgress } from '@material-ui/core';

// *#@M0673835596l
https://github.com/laila-saw/awesomeap
ReactDOM.render(
  <Router>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>

  </Router>,
  document.getElementById('root')
);
function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <Routes>
      {user ? <Route exact path="/" element={<Home />} /> : <Route path="/" element={<Navigate replace to="/login" />} />}
      {user ? <Route path="/login" element={<Navigate replace to="/" />} /> : <Route path="/login" element={<Login />} />}
      {user ? <Route path="/profile/:userId" element={<Profile />} /> : <Route path="/profile/:userId" element={<Navigate replace to="/login" />} />}
      <Route path="/register" element={<Register />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/" element={<Home />} />



    </Routes>
  )
}
function Home() {
  // controlle rightbar 
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  )
}
// component
// topbar
function Topbar() {
  const {user}=useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <>
    <input
            hidden
            className="searchbarControllerInput"
            type="checkbox"
            name="searchbarController"
            id="searchbarController" />
    <div className="topbarContainer">
      <div className="topbarLeft">
        <label htmlFor="sidebarController" className="controlerSidbar">
          <span className="center"></span>
          <span className="side"></span>
        </label>
        <Link to="/">
          <span className="logo">AwesomeApp</span>
        </Link>
      </div>
      
      <div className="topbarCenter">
        <div className="searchbar">
          <input
            placeholder="Search for friend, post or video"
            type="text"
            className="searchInput" />
             <label htmlFor="searchbarController" className="fa fa-search"></label>
        </div>
      </div>
      <div className="topbarRight">
     
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <i className="fa fa-user"></i>
            <span className="topIconBage">1</span>
          </div>
          <div className="topbarIconItem">
            <i className="fa fa-comment"></i>
            <span className="topIconBage">2</span>
          </div>
          <div className="topbarIconItem">
            <i className="fa fa-bell"></i>
            <span className="topIconBage">3</span>
          </div>
          <label 
          htmlFor="rightbarController"
          title="online friends" 
          className="topbarIconItem rightbarController">
          <i class="fas fa-user-friends"></i>
            <span style={{backgroundColor:"var(--successColor)"}} className="topIconBage"></span>
          </label>
        </div>
        <Link to={`/profile/${user._id}`}>
          <img
          src={PF+user.profilePicture ? PF+user.profilePicture : PF+"persons/noimg.png" }
          alt=""
          className="topbarImg myprofilpic" />
        </Link>
        
      </div>
    </div>
    </>
    
  )
}
// !topbar
// sidebar
function Sidebar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user,dispatch}=useContext(AuthContext);
  const handleLogOut=()=>{
    dispatch({type:"LOGOUT"});
  }
  return (
    <>
    <input
            hidden
            className="sidebarControllerInput"
            type="checkbox"
            name="sidebarController"
            id="sidebarController" />
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <i className="fas fa-rss"></i>
            <span className="text">Feed</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-comment-alt"></i>
            <span className="text">Chats</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-play-circle"></i>
            <span className="text">Videos</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-users"></i>
            <span className="text">Groups</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-bookmark"></i>
            <span className="text">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-question-circle"></i>
            <span className="text">Questions</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-briefcase"></i>
            <span className="text">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-calendar-alt"></i>
            <span className="text">Events</span>
          </li>
          <li className="sidebarListItem">
            <i className="fas fa-graduation-cap"></i>
            <span className="text">Coures</span>
          </li>
          <li className="sidebarListItem" onClick={handleLogOut}>
          <i className="fas fa-sign-out-alt"></i>
            <span className="text">LogOut</span>
          </li>
        </ul>
        <button className="sidebarBtn">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {/* {Users.map(u => (
            <li key={u.id} className="sidebarFriend">
              <img src={PF+u.profilPicture} alt="" className="myprofilpic" />
              <span className="name">{u.username}</span>
            </li>
          ))} */}

        </ul>
      </div>
    </div>
    </>
    
  )
}
// !sidebar
// Feed
function Feed({ userId }) {

  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);
  console.log({userId});
  console.log(user._id);
  useEffect(() => {
    const fetchPosts = async () => {
      (userId ?
        axios.get('/posts/profile/' + userId) :
        axios.get('posts/timeline/' +user._id))
        .then(res => setPosts(
          res.data.sort((p1,p2)=>{
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
          ))
        .catch(err => {
          console.log(err)
        })
    }
    fetchPosts();
  }, [userId,user._id]);//
  return (
    <div className="feed" >
      <div className="feedWrapper" >
        {(!userId || userId===user._id) && <Share />}
        {posts.length>=1 
        ? (posts.map(p => (
          <Post key={p._id} post={p} />
        )))
      : (<div className="noPost">
        <div className="noPostText">There is no post to show !</div>
        <div className="noPostIcon"><i className="fa fa-cloud"></i></div>
      </div>)

      }


      </div>
    </div>
  )
}
// Share 
function Share() {
  // create a new post !!
  //handleClick async 
  const desc = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user}=useContext(AuthContext);
  const [file,setFile]=useState(null)
  
  const handleClick = async (e) =>{
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value
    }
    if(file){
      const data =new FormData();
      const filename=file.name;
      data.append("file",file);
      data.append("name",filename);
      newPost.img=filename;
      try{
        await axios.post("/upload",data);
      }catch(err){
        console.log("the error : "+err)
      }
      
    }
    try{
      await axios.post("/posts",newPost);
      window.location.reload();
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="myprofilpic"
            src={user.profilePicture ? PF+user.profilePicture : PF+"persons/noimg.png" }
            alt="" />
          <div
            action=""
            className="shareForm">
            <input
              className="shareInput"
              type="text"
              ref={desc}
              placeholder={`What's in your minde ${user.username} ?`} />
          </div>
        </div>
        <hr className="shareHr" />
        {file &&(
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <i className="fa fa-times" onClick={()=>setFile(null)}></i>
          </div>
        )}
        <form
          className="shareBottom"
          onSubmit={handleClick}
        >
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <i style={{ color: "tomato" }} className="shareIcon fa fa-photo-video"></i>
              <span  className="optionTxt">Photo or video</span>
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                hidden />
            </label>
            <div className="shareOption">
              <i style={{ color: "blue" }} className="shareIcon fa fa-tag"></i>
              <span className="optionTxt">Tag</span>
            </div>
            <div className="shareOption">
              <i style={{ color: "green" }} className="shareIcon fa fa-map-marker"></i>
              <span className="optionTxt">Location</span>
            </div>
            <div className="shareOption">
              <i style={{ color: "goldenrod" }} className="shareIcon fa fa-grin-alt"></i>
              <span className="optionTxt">Feelings</span>
            </div>
          </div>
          <button className="shareBtn">Share</button>
        </form>
      </div>

    </div>
  )
}
// !Share 
// post 
function Post({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post.likes.length);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user:currentUser}=useContext(AuthContext);
  const [user, setUser] = useState({});
  const [optionPost, setOptionPost] = useState(false);
  const [desc, setDesc] = useState(post.desc);
  const [isShow, showEditor] = useState(false);
  const laila=useRef();
  const ref=useRef(null)
  useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id,post.likes])
  useEffect(() => {
    const fetchUsers = async () => {
      axios.get(`/users?userId=${post.userId}`)
        .then(res => setUser(res.data))
        .catch(err => {
          console.log(err)
        })
    }
    fetchUsers();
  }, [post.userId]);//
  const likeHandler = async () => {
    try{
      await axios.put(`/posts/${post._id}/like`,{userId:currentUser._id});
    }catch(err){
      console.log(err)
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked)
  }
  
  function showEditArea(){
    showEditor(true)
  }
  function useClickOutside(ref,handler){
    useEffect(()=>{
      const lisner = event=>{
        const el=ref?.current;
        if(!el || el.contains(event.target)){
          return ;
        }
        handler(event)
      };
      document.addEventListener('mousedown',lisner);
      document.addEventListener('touchstart',lisner);
      return () =>{
        document.removeEventListener('mousedown',lisner);
      document.removeEventListener('touchstart',lisner);
      }
    },[ref,handler]);
  }
  useClickOutside(ref, () => setOptionPost(false))
  async function deletePost(){
    try{
      console.log(currentUser._id);
      await axios.delete("/posts/"+post._id,{data:{userId:currentUser._id}});
      window.location.reload();
    }catch(error){
      console.log(error);
    }
  }
  function conselEdit(){
    console.log("lailaa");
    showEditor(false)
  }
 async function editPost(){
    try{
      await axios.put("/posts/"+post._id,{userId:currentUser._id,desc:laila.current.value});
      window.location.reload();
    }catch(error){
      console.log(error);
    }
  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={"profile/" + user._id}>
              <img
                src={user.profilePicture ? PF+user.profilePicture : PF + "persons/noimg.png"}
                alt=""
                className="myprofilpic" />
            </Link>
            <span className="postName">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight" ref={ref}>
            <div className="dots" onClick={()=>setOptionPost(!optionPost)}>
              <div style={{ backgroundColor: "aqua" }} className="dot"></div>
              <div style={{ backgroundColor: "tomato" }} className="dot"></div>
              <div style={{ backgroundColor: "blue" }} className="dot"></div>
            </div>
            {optionPost &&  <div className="postTopRightOptions">
              <div className="optionItem"
                onClick={showEditArea}>
                <i 
                className="fa fa-edit"
                  style={{ color: "var(--successColor)" }}
                ></i>
                <div
                  className="optionText">Edit</div>
              </div>
              <div className="optionItem"
                onClick={deletePost} >
                <i
                className="fa fa-trash-alt"
                  style={{ color: "red" }}
                ></i>
                <div
                  className="optionText">Delete</div>
              </div>
            </div> }
          </div>
        </div>
        {!isShow 
        ?<div className="postCenter">
          <div className="postText">
             <>{post.desc}</> 
            </div>
          {post.img ?  <img
            className="postImg"
            style={{marginTop:post.desc? "20px" : "0"}}
            src={PF + post.img}
            alt="" />   : ''}
        </div>
          : <div className="editPostContainer">
            <input className="editPost" ref={laila} type="text" value={desc} onChange={(e) => { setDesc(e.target.value) }} />
            <div className="btns">
            <button className="editBtn" style={{backgroundColor:"var(--successColor)"}} onClick={editPost}>Edit</button>
            <button className="editBtn" onClick={conselEdit}>Consel</button>
            </div>
          </div>
           
            }
        <div className="postBottom">
          <div className="postBottomLeft">
            <i onClick={likeHandler} style={{ backgroundColor: isLiked && "red", color: "white" }} className="iconLike fas fa-heart"></i>
            <span className="likeCounter"><span className="counter">{like}</span> people like it</span>
          </div>
          <div className="postBottomRight">
            <div className="postCommentText"><span className="counter">{post.comment}</span> comments</div>
          </div>
        </div>
      </div>
    </div>
  )
}
// !post 
// !Feed
// Rightbar
function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [followings,setFollowings]=useState([]);
  const {user:currentUser, dispatch}=useContext(AuthContext);
  const [isfollowed,setIsfollowed]=useState(false); 
    useEffect(()=>{
  setIsfollowed(currentUser.followings.includes(user?._id));
},[currentUser._id,user?._id])
  useEffect(()=>{
    const getFollowings=async()=>{
      try{
      const followings = await axios.get("/users/followings/"+user?._id);
      setFollowings(followings.data);
    }catch(err)
    {
      console.log(err);
    }
    }
    getFollowings();
  },[user]);

  async function handleClick() {
    try {
      if (isfollowed) {
        await axios.put("/users/" + user._id + "/unfollow", { userId: currentUser._id });
        dispatch({ type: "UNFOLLOW", payload: user._id })
      } else {
        await axios.put("/users/" + user._id + "/follow", { userId: currentUser._id });
        dispatch({ type: "FOLLOW", payload: user._id })
      }
    } catch (err) {
      console.log(err);
    }
    console.log("lailaa" + isfollowed);
    setIsfollowed(!isfollowed);
  }
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <div className="iconGift"><i className="fa fa-gift"></i></div>
          <span className="birthdayText"><strong style={{fontWeight:"bold"}}>Mohamed</strong> & <strong style={{fontWeight:"bold"}}>3 other friends</strong> have a birthday today.</span>
        </div>
        <img src="/assets/posts/p2.png" alt="" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="friendList">
          {/* {Users.map(u=>( 
            <li key={u.id} className="friend">
            <div className="imgContainer">
              <img
                src={PF+u.profilPicture}
                alt=""
                className="topbarImg myprofilpic" />
              <span className="rightbarOnline"></span>
            </div>
            <div className="friendName">{u.username}</div>
          </li>
          ) )} */}

        </ul>
      </>
    )
  }
  const ProfileRightbar = () => {
    
    return (
      <>
      {user._id !==currentUser._id && (
          <button
            className="rightbarFollowBtn"
            onClick={handleClick}
          >
            {isfollowed ? "Unfollow" : "Follow"}
            {isfollowed ? (<i style={{color:"red"}} className="fa fa-times"></i> ): (<i style={{color:"var(--successColor)"}} className="fa fa-plus"></i>)}
          </button>
      )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City :</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">from :</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">RelationShip :</span>
            <span className="rightbarInfoValue">{user.relationship === 1 ? "single" : user.relationship === 2 ? "married" : "-"}</span>
          </div>
        </div>
        {/* <h4 className="rightbarTitle">Experiences Profetionnels</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Date : </span>
          <span className="rightbarInfoValue">Experience</span>
        </div>
        <form action="" className="addItemForm"></form>
        <button className="addItemBtn"><i className="fa fa-plus"></i></button>
      </div>
      <h4 className="rightbarTitle">Formations</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Date : </span>
          <span className="rightbarInfoValue">Formation</span>
        </div>
      </div>
      <button className="addItem"><i className="fa fa-plus"></i></button>
      <h4 className="rightbarTitle">Hobbies</h4>
      <div className="hobbies">
        <div className="hobbie">Programming</div>
        <div className="hobbie">Cooking</div>
        <div className="hobbie">fitness</div>
        <div className="hobbie">watch movies</div>
      </div>
      <button className="addItem"><i className="fa fa-plus"></i></button> */}
        <h4 className="rightbarTitle">Followings</h4>
        <div className="rightbarGallery rightbarInfo" style={{justifyContent:followings.length>=3 ? "center" : "flex-start"}}>
          {followings.map((f)=>(
            <Link to={"/profile/"+f._id}>
              <div className="friendIthem" key={f._id}>
                <div className="image">
                  <img
                    src={f.profilePicture
                      ? PF + f.profilePicture
                      : PF + "persons/noimg.png"}
                    alt="" className="gelleyImg" />
                </div>
                <div className="friendName">{f.username}</div>
              </div>
            </Link>
            )
          )}
          
        </div>
        <h4 className="rightbarTitle">Gallery</h4>
        <div className="rightbarGallery rightbarInfo">
          <div className="image">
            <img src="/assets/persons/p1.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p2.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p3.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p4.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p5.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p6.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p7.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p8.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p9.png" alt="" className="gelleyImg" />
          </div>
          <div className="image">
            <img src="/assets/persons/p10.png" alt="" className="gelleyImg" />
          </div>
        </div>
      </>
    )
  }
  return (
    <>
     <input
            hidden
            className="rightbarControllerInput"
            type="checkbox"
            name="rightbarController"
            id="rightbarController" />
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div></>
  
    
    
  )
}
// !Rightbar
// profile
function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const userId = useParams().userId;

  const [user, setUser] = useState({});
  // console.log(userId)
  useEffect(() => {
    const fetchUsers = async () => {
      axios.get(`/users?userId=${userId}`)
        .then(res => setUser(res.data))
        .catch(err => {
          console.log(err)
        })
    }
    fetchUsers();
  }, [userId]);//
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={user.coverPicture? PF+user.coverPicture : `${PF}persons/nocoverimg.png`}
                alt=""
                className="profileCoverImg" />
              <img
                src={user.profilePicture? PF+user.profilePicture : `${PF}persons/noimg.png`}
                alt=""
                className="myprofilpic" />
            </div>
            <div className="profileInfo">
              <h4 className="name">{user.username}</h4>
              <span className="desc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed userId={userId} />
            <Rightbar user={user} />
          </div>

        </div>

      </div>
    </>
  )
}
// !profile


// apicalls 
const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
}

// !apicalls 


// login 
function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFeching, error, dispatch } = useContext(AuthContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    loginCall({ email: email.current.value, password: password.current.value }, dispatch);
   
      // localStorage.setItem('Password', password.current.value);

  };
  console.log(user);
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">AwesomeApp.</h3>
          <div className="loginDesc">Connect with friends & the world around you on AwesomeApp.</div>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick} >
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              required
              ref={email} />
            <input
              type="password"
              minLength="6"
              placeholder="Password"
              className="loginInput"
              required
              ref={password} />
            <button className="loginButton" disabled={isFeching ? true : false}> {isFeching ? <CircularProgress color="primary" size="25px" /> : "Log In"} </button>
            <span className="loginForgot">Forgot Password?</span>
            <div className="register">You don't have an account? <span className="registerbtn">Sign Up</span> </div>
          </form>
        </div>
      </div>
    </div>
  )
}
// !login 
// register 
function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const conPassword = useRef();
  const navigate =useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    if(conPassword.current.value!==password.current.value){
      password.current.setCustomValidity("password does not match")
    }else{
      // creat the user 
      const user={
        username :username.current.value,
        email :email.current.value,
        password :password.current.value,

      }
      // send the user to data base 
      try{
      await axios.post("/auth/register",user);
      navigate("/login");
      console.log(navigate("/login"))
      }catch(err){
        console.log(err);
      }
    }
  };
  return (
    <div className="login register">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">AwesomeApp.</h3>
          <div className="loginDesc">Connect with friends & the world around you on AwesomeApp.</div>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
          <input
              type="text"
              placeholder="User Name"
              className="loginInput"
              required
              ref={username} />
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              required
              ref={email} />
            <input
              type="password"
              minLength="6"
              placeholder="Password"
              className="loginInput"
              required
              ref={password} />
            <input
              type="password"
              minLength="6"
              placeholder="Confirme Password" 
              className="loginInput"
              required
              ref={conPassword} />
            <button
              className="loginButton">Sign Up</button>
            <div className="register">You Already have an account? <span className="registerbtn">Log In</span> </div>
          </form>
        </div>
      </div>
    </div>
  )
}
// !register


