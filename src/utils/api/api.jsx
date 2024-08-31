import { config } from "../../config/config";
const API_URL = config.API_URL
const USER_API_URL = config.USER_API_URL
const CLIENT_API_URL = config.CLIENT_API_URL
const ADMIN_API_URL = config.ADMIN_API_URL



export const refreshTokenAPI = `${API_URL}/refresh`

//user
export const addprofileApi = `${USER_API_URL}/addProfile`
export const addprofilesecApi = `${USER_API_URL}/addProfilesec`
export const addExperienceApi = `${USER_API_URL}/experience`
export const isUserprofileApi = `${USER_API_URL}/isUserprofileApi`
export const getDataApi = `${USER_API_URL}/getData`
export const getJobPost = `${USER_API_URL}/JobPost`
export const browseJobpost = `${USER_API_URL}/browseJobpost`
export const ApplyNowApi = `${USER_API_URL}/applynow`
export const NotificationsApi = `${USER_API_URL}/notification`
export const NotificationMarkasReadApi = `${USER_API_URL}/markasRead`
export const browseContractDetails = `${USER_API_URL}/userContract`
export const ContractActionApi = `${USER_API_URL}/Contractaction`
export const quitContractApi = `${USER_API_URL}/quitContractaction`
export const browseAcceptedContracts = `${USER_API_URL}/acceptedContract`
export const submitjobapi = `${USER_API_URL}/submit`
export const findWorkapi = `${USER_API_URL}/findjobs`
export const findjobProposalapi = `${USER_API_URL}/alljobproposals`
export const viewjobProposalapi = `${USER_API_URL}/viewjobproposal`
export const userProfileApi = `${USER_API_URL}/userInfo`
export const saveJobApi = `${USER_API_URL}/saveJob`
export const unsaveJobApi = `${USER_API_URL}/unsaveJob`
export const getsavedJobApi = `${USER_API_URL}/savedjob`
export const disLikeJobApi = `${USER_API_URL}/disLikejob`
export const LikeJobApi = `${USER_API_URL}/Likejob`
export const editJobProposalApi  = `${USER_API_URL}/editproposal`
export const deleteProposalApi = `${USER_API_URL}/deleteProposal`
export const editImageApi = `${USER_API_URL}/editImage`
export const recruiterRating = `${USER_API_URL}/rating`

export const userChatsApi = `${USER_API_URL}/getchat`
export const clientdataApi = `${USER_API_URL}/getclientInfo`
export const getmessagesApi = `${USER_API_URL}/getmessages`
export const addmessageApi = `${USER_API_URL}/addmessages`
export const countUnreadMessages = `${USER_API_URL}/unReadmessages`
export const markasReadMessages = `${USER_API_URL}/markAsRead`
export const addImageFilemessageApi = `${USER_API_URL}/addImageFilemessages`
export const addAudioFilemessageApi = `${USER_API_URL}/addAudioFilemessages`
export const addVideoFilemessageApi = `${USER_API_URL}/addVideoFilemessages`
export const addVoiceFilemessageApi = `${USER_API_URL}/addVoiceFilemessages`



//client
export const browseUsers = `${CLIENT_API_URL}/browseUsers`
export const jobSubmit = `${CLIENT_API_URL}/jobSubmit`
export const browseJobApi = `${CLIENT_API_URL}/browseJob`
export const browseJobPostsApi = `${CLIENT_API_URL}/browseJobposts`
export const browseProposalsApi = `${CLIENT_API_URL}/browseJobProposals`
export const shortListJobProposalsApi = `${CLIENT_API_URL}/shortListJobProposals`
export const unshortListJobProposalsApi = `${CLIENT_API_URL}/unshortListJobProposals`
export const archiveJobProposalsApi = `${CLIENT_API_URL}/archiveJobProposals`
export const unarchiveJobProposalsApi = `${CLIENT_API_URL}/unarchiveJobProposals`
export const declineJobProposalsApi = `${CLIENT_API_URL}/declineJobProposals`
export const browseOfferletter = `${CLIENT_API_URL}/browseOfferletter`
export const createContractApi = `${CLIENT_API_URL}/createContract`
export const saveAddressApi = `${CLIENT_API_URL}/saveAddress`
export const paymentApi = `${CLIENT_API_URL}/payment`
export const verifypaymentApi = `${CLIENT_API_URL}/verifypayment`
export const browseContracts = `${CLIENT_API_URL}/contracts`
export const paymentAfterEditApi = `${CLIENT_API_URL}/paymentAfter`
export const getContractDetails = `${CLIENT_API_URL}/getContract`
export const deleteJobApi = `${CLIENT_API_URL}/deleteJob`
export const findUserByIdApi = `${CLIENT_API_URL}/findProfile`
export const browseSubmittedApi = `${CLIENT_API_URL}/submittedContract`
export const stripePaymentApi = `${CLIENT_API_URL}/stripePayment`
export const browseTransaction = `${CLIENT_API_URL}/transaction`
export const fetchTransactionsApi = `${CLIENT_API_URL}/alltransaction`
export const fetchWalletApi = `${CLIENT_API_URL}/wallettransaction`
export const browseSubmitted = `${CLIENT_API_URL}/browseSubmitted`
export const acceptjobsubmit = `${CLIENT_API_URL}/acceptJobSubmit`
export const rejectJobSubmit = `${CLIENT_API_URL}/rejectJobSubmit`

export const createChatsApi = `${CLIENT_API_URL}/createChat`
export const clientChatsApi = `${CLIENT_API_URL}/browseChat`
export const userdataApi = `${CLIENT_API_URL}/getuserInfo`
export const getClientMessageapi = `${CLIENT_API_URL}/getclientmessage`
export const addClientMessageapi = `${CLIENT_API_URL}/addclientmessage`
export const clientcountUnreadMessages = `${CLIENT_API_URL}/clientunReadmessages`
export const clientmarkasReadMessages = `${CLIENT_API_URL}/clientmarkAsRead`
export const freelanceRating = `${CLIENT_API_URL}/rating`


export const clientaddImageFilemessageApi = `${CLIENT_API_URL}/addImagemessages`
export const clientaddAudioFilemessageApi = `${CLIENT_API_URL}/addAudiomessages`
export const clientaddVideoFilemessageApi = `${CLIENT_API_URL}/addVideomessages`
export const clientaddVoiceFilemessageApi = `${CLIENT_API_URL}/addVoicemessages`




// admin
export const collectUserDataApi = `${ADMIN_API_URL}/userData`
export const SearchInfoApi = `${ADMIN_API_URL}/search?search:`
export const collectClientsDataApi = `${ADMIN_API_URL}/clientData`
export const blockUserApi = `${ADMIN_API_URL}/blockUser`
export const unblockUserApi = `${ADMIN_API_URL}/unblockUser`
export const blockClientApi = `${ADMIN_API_URL}/blockClient`
export const unblockClientApi = `${ADMIN_API_URL}/unblockClient`
export const adminDataApi = `${ADMIN_API_URL}/browseData`