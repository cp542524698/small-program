var host = 'https://cephcp.ztgame.com.cn/ztgame/';   //ztgame是变量，修改为具体的企业名称即可

var session = host + 'session';
var company = host + 'company/new';
var staffsList = host + 'company/staffs'
var companyList = host + 'user/companies';
var companyDetail = host + 'user/company';
var joinCompany = host + 'join/company';
var changName = host + 'company/change';
var changLocation = host + 'company/changeLocation';
var savetime = host + 'company/savetime';
var information = host + 'company/information';
var applylist = host + 'company/applylist';
var verifyApply = host + 'company/verify';
var getrelation = host + 'getrelation';
var commit = host + 'commit';
var gettime = host + 'gettime';
var delstaff = host + 'delstaff';
var detail = host + 'detail';


var deleteCompany = host + 'company/now?token=';
var worktime = host + 'company/information?token=' //用于获取该公司上班时间
var staffAttdance = host + 'company/staffs/day?token='

var qrcode = host + 'qrcode/get?token='

var tofree = host + 'user/tofree?token='


module.exports = {
    session: session,
    company: company,
    companyList: companyList,
    companyDetail: companyDetail,
    joinCompany: joinCompany,
    applylist: applylist,
    deleteCompany: deleteCompany,
    verifyApply: verifyApply,
    staffsList: staffsList,
    worktime: worktime,
    information: information,
    staffAttdance: staffAttdance,
    qrcode: qrcode,
    tofree: tofree,
    changName:changName,
    changLocation: changLocation,
    savetime: savetime,
    getrelation: getrelation,
    commit: commit,
    gettime: gettime,
    delstaff: delstaff,
    detail: detail,
}

//58b42745679e8155e0a771de
//58b42b04679e8155e0a771e0

//新增公司
//POST  http://localhost:?/company/new?token=${token}

//获取公司列表
//GET   http://localhost:?/user/companies?token=${token}


//查看公司详情
//GET  http://localhost:?/user/company/:id?token=${token}


//申请加入
//POST  http://localhost:?/user/company?token=${token}


//获取申请人员列表
//GET    http://localhost:?/company/applylist?token=${token}

//删除公司信息
//DELETE    http://localhost:?/company/now?token=${token}



//验证申请人员
//POST    http://localhost:?/company/applylist/:applyId?token=${token}


//获取单天成员打卡信息
//  POST    http://localhost:?/company/staffs/day?token=${token}


//获取成员列表
//GET    http://localhost:?/company/staffs?token=${token}

//获取二维码
//GET    http://localhost:?/qrcode/get?token=${token}

//退出公司
//  DELETE    http://localhost:?/user/tofree?token=${token}
