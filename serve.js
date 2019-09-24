const Koa = require('koa');
const multer=require('koa-multer');
const Router=require('koa-router');
const views=require('koa-views');
const serve = require('koa-static');
const path=require('path');
const app=new Koa();

// koa2跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
});
app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method === 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});

//加载模板引擎
app.use(views(path.join(__dirname, './views'),{
    extension:'ejs'
}));

const router=new Router()
router.get('/',async (ctx,next)=>{
    let title = '文件上传';
    await ctx.render('index', {
        title
    })
});

// 1.主页静态网页 把静态页统一放到public中管理
const home   = serve(path.join(__dirname)+'/public/');


//配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        console.log('改变名字的地方：', req.body.name)
        console.log('改变名字的地方1：', req.body)
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null,req.body.stuName + "." + fileFormat[fileFormat.length - 1]);
        // cb(null,req.body.name + "." + fileFormat[fileFormat.length - 1]);
    }
});

//加载配置
var upload = multer({ storage: storage });
//路由
router.post('/upload',upload.single('file'),async(ctx,next)=>{
    // 请求的参数为
    // var param = ctx.req.body;

    // 获取保存的路径
    // var path = ctx.req.file;

    console.log('path1 is:', path1)
    console.log('path2 is:', path2)

    var path = ctx.req.file.path.split('/')
    path =  path[1] + '/' + path[2];
    var port = ctx.req.headers.host.split(':')[1]
    ctx.body = {
        filename: ctx.req.file.filename.split('.')[0],//返回文件名
        url:'http://' + ctx.req.headers.host+ '/' + path, // 返回访问路径
        rank: ctx.req.body.rank,
        time: ctx.req.body.time
    }
});

app.use(router.routes(), router.allowedMethods())
app.use(home);

app.listen(6700,()=>{
    console.log('Server is running at port 6700...')
});
