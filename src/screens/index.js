import HomeScreen from './Home/index';
import Account from './Account/index';
import Notifications from './Notifications/index';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ForgetPassword from './Auth/ForgetPassword';
import EmailVerificationSent from './Auth/EmailVerificationSent';
import CreateNewPassword from './Auth/CreateNewPassword';
import SettingProfile from './Account/my_profil/SettingProfile';
import SettingAddress from './Account/my_profil/SettingAddress';
import ChangePassword from './Account/ChangePassword';
import Membership from './Account/my_profil/Membership';
import FriendList from './Account/friend-list/index';
//Forum
import ForumScreen from './Forum/index';
import DetailThread from './Forum/DetailThread';
import CreateThread from './Forum/CreateThread';
import ReplyThread from './Forum/ReplyThread';
import ReportThread from './Forum/ReportThread';
import CreateComment from './Forum/CreateComment';
import EditThread from './Forum/EditThread';
import MyForum from './Forum/MyForum/index';
import MyLiked from './Forum/MyForum/MyLiked';
import ReportComment from './Forum/ReportComment';
import Bookmark from './Forum/Bookmarks/Bookmark';
import SearchBar from './Forum/SearchBar';
import ResultSearch from './Forum/ResultSearch';
import Profil from './Forum/Profile';

//marketplace
import Payment from './Marketplace/payment';
import WaitingPayment from './Marketplace/waiting_payment';
import DetailPayment from './Marketplace/detail_payment';
import Cart from './Marketplace/cart';
import Checkout from './Marketplace/checkout';
import ProductsList from './Marketplace/product_list/index';
import ProductDetail from './Marketplace/product_detail/index';
import DetailArticle from './Article/DetailArticle';
import OnTesting from './Home/OnTesting';
import CustomPage from './Home/CustomPage';
import OrderList from './Marketplace/order_list/index';
import Wishlist from './Marketplace/wishlist/index';
import Rating from './Marketplace/rating/index'
import OrderDetail from './Marketplace/order_detail/index'
import SellerProfile from './Marketplace/seller/index'
import AuctionList from './Marketplace/product_list/auction'

//webinar
import Dashboard from './Webinar/Dashboard';
import EventList from './Webinar/EventList';
import EventDetail from './Webinar/details/EventDetail';
import SpeakerList from './Webinar/SpeakerList';
import SpeakerDetail from './Webinar/details/SpeakerDetail';
import TicketList from './Webinar/TicketList';
import TicketDetail from './Webinar/details/TicketDetail';

//auction
import DetailAuction from './Auction/detail_auction/index';
import HomeAuction from './Auction/home_auction/index';
import HistoryAuction from './Auction/history/index';
import SearchAuction from './Marketplace/components/SearchAuction';

//Help Center
import Faq from './Drs/Faq';
import HelpCenterChat from './Drs/HelpCenterChat';
import HelpCenterChatMessage from './Drs/HelpCenterChatMessage';
import HelpCenterContact from './Drs/HelpCenterContact';

// Chat
import Chat from './Chat/Chat';
import ChatMessage from './Chat/ChatMessage';
import ChatOptions from './Chat/ChatOptions';

import Mapbox from '../components/Mapbox/index'

export {
  ProductsList,
  HomeScreen,
  Account,
  Notifications,
  ProductDetail,
  DetailArticle,
  OnTesting,
  CustomPage,
  Login,
  Register,
  ForgetPassword,
  CreateNewPassword,
  SettingProfile,
  SettingAddress,
  ChangePassword,
  Membership,
  EmailVerificationSent,
  FriendList,
  OrderDetail,
  SellerProfile,
  AuctionList,

  // Forum
  ForumScreen,
  DetailThread,
  CreateThread,
  ReplyThread,
  ReportThread,
  CreateComment,
  EditThread,
  MyForum,
  ReportComment,
  Bookmark,
  Cart,
  Checkout,
  Payment,
  WaitingPayment,
  DetailPayment,
  SearchBar,
  ResultSearch,
  Profil,
  OrderList,
  DetailAuction,
  HomeAuction,
  HistoryAuction,
  Wishlist,
  SearchAuction,
  Rating,
  MyLiked,

  //webinar
  Dashboard,
  EventList,
  EventDetail,
  SpeakerList,
  SpeakerDetail,
  TicketList,
  TicketDetail,

  Chat,
  ChatMessage,
  ChatOptions,

  Faq,
  HelpCenterChat,
  HelpCenterChatMessage,
  HelpCenterContact,

  Mapbox,
};
