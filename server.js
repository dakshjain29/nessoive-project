var express = require("express");
var fileuploader=require("express-fileupload")
let app=express();
var mysql2=require("mysql2");
var nodemailer= require("nodemailer");
app.listen(1931,function()
{
    console.log("Server Started ....... at this host");
})
app.use(fileuploader());
app.use(express.static("public"));
app.use(express.urlencoded("true"));
let status;
//  let config = {             /////mysql databse connectivity
//      host :"127.0.0.1",
//      user:"root",
//      password:"daksh@1829",                                       
//      database:"project",
//      dateStrings:true
//  }

 let config = {             /////mysql databse connectivity
    host :"bja9zz0bj4hctmw8wbni-mysql.services.clever-cloud.com",
    user:"uw6jrjwdrdh8cu9x",
    password:"U7aGK1nuLA2Bs2I2bcc9",                                       
    database:"bja9zz0bj4hctmw8wbni",
    dateStrings:true,
    keepAliveInitialDelay : 10000,
    enableKeepAlive : true,
}
 var mysql = mysql2.createConnection(config);
 mysql.connect(function(err)
 {
     if(err==null)
         console.log("Connected to Database Successfully");
     else
     console.log(err.message+"########");
 })

/////////////////////////////////////////////////////
app.get("/",function(req,resp)
{
    let path = __dirname+"/public/index.html";
    resp.sendFile(path);
})

app.post("/signup-details",function(req,resp)
 {
     status=1;
   
     mysql.query("insert into users values(?,?,?,?)",[req.body.stxtEmail,req.body.stxtPwd,req.body.type,status],function(err)
    {
         if(err==null)
             resp.send("Successfully Saved");
         else
             resp.send(err.message);
    })
    
   
 })
/////////////////////////////////////////////////

app.get("/check-login-details",function(req,resp)
{
    let email= req.query.txtEmail;
    //console.log(email);
    let pwd = req.query.txtPwd;
    //let status=req.query.status;
    mysql.query("select * from users where email=? and pwd=?",[email,pwd],function(err,resultJsonAry){
        console.log(resultJsonAry);
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
        else if(resultJsonAry.length==0){
            resp.send("INVALID EMAIL/PASSWORD");
        }
        else if(resultJsonAry[0].status==1){
            
            resp.send(resultJsonAry[0].utype);
           
           
        }
        else{
            resp.send("YOU ARE BLOCKED")
        }
    })

})


app.get("/infl-dashboard",function(req,resp){

    let path=__dirname+"/public/infl-dash.html";
    resp.sendFile(path);
})



app.get("/infl-profile",function(req,resp){
    let path=__dirname+"/public/inf-profile.html";
    resp.sendFile(path);
})


app.post("/idata-save",function(req,resp){

    let fileName="";
    if(req.files!=null)
        {
             fileName=req.files.ppic.name;
            let path=__dirname+"/public/upload/"+fileName;
            req.files.ppic.mv(path);
        }
        else
        {
            fileName=req.body.hdn;
        }
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtEmail,req.body.txtName,req.body.txtGender,req.body.txtDob,req.body.txtAdd,req.body.txtCity,req.body.txtContact,req.body.txtField.toString(),req.body.txtInsta,req.body.txtYt,req.body.txtOther,fileName],function(err,result){

        if(err==null){
            resp.send("inserted");
        }
        else{
            resp.send(err.message);
        }
    })
})

app.post("/iprofile-update",function(req,resp)
{
    console.log(req.body);


    
    let fileName="";
    if(req.files!=null)
        {
             fileName=req.files.ppic.name;
            let path=__dirname+"/public/upload/"+fileName;
            req.files.ppic.mv(path);
        }
        else
        {
            fileName=req.body.hdn;
        }

    
    mysql.query("update iprofile set iname=?, gender=? , dob=? ,address=?,city=?,contact=?,field=?,insta=?,youtube=?,other=?,picpath=? where email=?",[req.body.txtName,req.body.txtGender,req.body.txtDob,req.body.txtAdd,req.body.txtCity,req.body.txtContact,req.body.txtField.toString(),req.body.txtInsta,req.body.txtYt,req.body.txtOther,fileName,req.body.txtEmail],function(err,result)
    {
        if(err==null)//no error
        {
               if(result.affectedRows>=1) 
                   resp.send("Updated  Successfulllyyyy....");
                else
                    resp.send("Invalid Email ID");
        }
    else
        resp.send(err.message);
    })
})


app.get("/find-user-details",function(req,resp){
     
    let iemail=req.query.txtEmail;
    mysql.query("select * from iprofile where email=?",[iemail],function(err,resultjsonary){

        if(err!=null){
            resp.send(err.message);
            return;
        }
        console.log(resultjsonary);
     resp.send(resultjsonary);
    })
})

app.get("/event-posting-process",function(req,resp){
    let pemail=req.query.btxtemail;
    let name=req.query.btxtname;
    let date=req.query.btxtdate;
    let city=req.query.btxtcity;
    let time=req.query.btime;
    let venue=req.query.btxtvenue;
    console.log(city);
    mysql.query("insert into events values(null,?,?,?,?,?,?)",[pemail,name,date,time,city,venue],function(err,result){

        if(err!=null){
            resp.send(err.message);
            return;
        }
        if(result.affectedRows>=1){
            resp.send("succesfull");
        }
        else{
            resp.send("not sent");
        }
    })
});



app.get("/change-password-process",function(req,resp){

    let cemail=req.query.ctxtemail;
    let opwd=req.query.otxtpwd;
    let npwd=req.query.ntxtpwd;
    let rpwd=req.query.rtxtpwd;

    //console.log(req.query);

    mysql.query("select * from users where email=? and pwd=?",[cemail,opwd],function(err,resultary){

       
        if(err==null){
            //console.log(resultary);

            
            if(resultary.length==0){
                resp.send("invalid email or password");
            }
    
            if(resultary.length>=1){
                //console.log(resultary.length);
                if(npwd==rpwd){
    
                    mysql.query("update users set pwd=? where email=?",[npwd,cemail],function(err,result){
                        if(result.affectedRows==0){
                            resp.send("not updated");
                        }
                        else{
                            resp.send("updated");
                        }
                    });
    
                }
                else{
                    resp.send("new password and repeated pass does not match");
                }
                  
            }
        }
        else{
            resp.send(err.message);
        }

    });

});

app.get("/admin-dashboard",function(req,resp){

    
    let path=__dirname+"/public/adminpass.html";
    resp.sendFile(path);
})


app.get("/all-user-manager",function(req,resp){

    let path=__dirname+"/public/admin-users.html";
    resp.sendFile(path);
})

app.get("/all-inf-console",function(req,resp){

    let path=__dirname+"/public/admin-all-influencer.html";
    resp.sendFile(path);
})


app.get("/fetch-all-user",function(req,resp){

    mysql.query("select * from users",[req.query.email,req.query.pwd,req.query.utype,req.query.status],function(err,resultjsonary){

        if(err!=null){
            resp.send(err.message);
            
        }
            console.log(resultjsonary);
            resp.send(resultjsonary);


    })
})

app.get("/show-selected",function(req,resp){

    
    mysql.query("select * from users where utype=?",[req.query.utype],function(err,resultjsonary){
        if(err!=null){
            resp.send(err.message);
        }
        resp.send(resultjsonary);
    })
})



app.get("/delete-one",function(req,resp){

    mysql.query("delete from users where email=?",[req.query.email],function(err,resultjsonary){
        if(err!=null){
            resp.send(err.message);
        }
        resp.send("deleted");
    })
})



app.get("/block-one",function(req,resp){

    status=0;

    mysql.query("update users set status=? where email=?",[status,req.query.email],function(err,resultjsonary){
        if(err!=null){
            resp.send(err.message);

        }
        resp.send("blocked");

    })

})



app.get("/resume-one",function(req,resp){

    status=1;

    mysql.query("update users set status=? where email=?",[status,req.query.email],function(err,resultjsonary){
        if(err!=null){
            resp.send(err.message);

        }
        resp.send("unblocked");

    })

})




app.get("/fetch-all-profile",function(req,resp){

    mysql.query("select * from iprofile",function(err,resultjsonary){

        if(err!=null){
            resp.send(err.message);
        }
        resp.send(resultjsonary);

    })
})


app.get("/influencer-find",function(req,resp){

    let path=__dirname+"/public/infl-finder.html";
    resp.sendFile(path);

})




app.get("/fetch-all-influencers",function(req,resp)
{
    mysql.query("select * from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
          //  console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
app.get("/fetch-all-fields",function(req,resp)
{
    mysql.query("select distinct field from iprofile",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
////////////////////////////////////////////////////////////////////////////////////
app.get("/fetch-some-field",function(req,resp)
{
    let field="%"+req.query.field+"%";
    mysql.query("select distinct city from iprofile where field like ?",[field],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
////////////////////////////////////////////////////////////////////////////////////////////
app.get("/fetch-all-details-selected-infl",function(req,resp)
{
    let city=req.query.city;
    let field=req.query.field;
    mysql.query("select * from iprofile where field like ? && city=?",["%"+req.query.field+"%",req.query.city],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
//////////////////////////////////////////////////////////////////////////////////////////////
app.get("/fetch-some-name",function(req,resp)
{
    let name=req.query.name;
    mysql.query("select * from iprofile where iname like ?",["%"+name+"%"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})



//=========================my=========================================

app.get("/infl-event-manager",function(req,resp){

    let path=__dirname+"/public/event-manager.html";
    resp.sendFile(path);
})

//==============================================================
app.get("/fetch-my-events",function(req,resp){

    let mail="%"+req.query.email+"%";

    mysql.query("select * from events where doe>=current_date() && email like ?",[mail],function(err,resultjsonary){

        if(err!=null){
            resp.send(err.message);
        }
        resp.send(resultjsonary);
        //console.log(resultjsonary);

    })
    
})
//===================================================

app.get("/event-delete",function(req,resp){

    mysql.query("delete from events where rid=?",[req.query.rid],function(err,resultjsonary){
        if(err!=null){
            resp.send(err.message);
        }
        resp.send("deleted");
    })
})


//======================================


app.get("/clt-profile",function(req,resp){

    let path=__dirname+"/public/client-profile.html";
    resp.sendFile(path);


});


app.get("/find-infl",function(req,resp){

    let path=__dirname+"/public/infl-finder.html";
    resp.sendFile(path);
});




app.get("/save-client-details",function(req,resp){

   console.log(req.query);
    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.query.cltxtemail,req.query.cltxtname,req.query.cltxtcity,req.query.cltxtstate,req.query.cltxtorg,req.query.cltxtcontact],function(err,result){

        if(err==null){
            resp.send("inserted");
        }
        else{
            resp.send(err.message);

        }
    })



})

app.get("/find-client-details",function(req,resp){

    let email=req.query.cltxtemail;

    mysql.query("select * from cprofile where email=?",[email],function(err,resultjsonary){

        if(err!=null){
            resp.send(err.message);
        }
        resp.send(resultjsonary);
    })



})


app.get("/update-client-details",function(req,resp){

    clemail=req.query.cltxtemail;
    clname=req.query.cltxtname;
    clcity=req.query.cltxtcity;
    clstate=req.query.cltxtstate;
    clorg=req.query.cltxtorg;
    clmob=req.query.cltxtmobile;
    

    
                    mysql.query("update cprofile set cname=?,city=?,state=?,org=?,mobile=? where email=?",[clname,clcity,clstate,clorg,clmob,clemail],function(err,result){
                        if(result.affectedRows==0){
                            resp.send("not updated");
                        }
                        else{
                            resp.send("updated");
                        }
                    });
    
               
                  
       
    });


app.get("/send-mail",function(req,resp){

let cltemail=req.query.cltemail;
let email=req.query.email;
console.log(req.query);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dakshj2090@gmail.com',
    pass: 'myplafkugaeiypzm'
  }
});


var mailOptions = {
  from: 'dakshj2090@gmail.com',
  to: email,
  subject: 'NEW BOOKING ',
  text: 'CLIENT INFORMATION '+cltemail
};

transporter.sendMail(mailOptions, function(err, info){
  if(err!=null){
    resp.send(err.message);
  } else {
    resp.send("email sent :" + info.response);
  }
});

})



app.get("/client-forgot-pwd", function (req, resp) {

    let email = req.query.txtEmail;

    mysql.query("select pwd from users where email = ?", [email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        if (result.length == 0) {
            resp.send("Email not found");
            return;
        }

        let pass = result[0].pwd;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'dakshj2090@gmail.com',
              pass: 'myplafkugaeiypzm'
            }
          });
          
          
          var mailOptions = {
            from: 'dakshj2090@gmail.com',
            to: email,
            subject: 'PASSWORD',
            text: 'YOUR PASSWORD IS: '+pass
          };
          
          transporter.sendMail(mailOptions, function(err, info){
            if(err!=null){
              resp.send(err.message);

            } else {
              console.log("email sent :" + info.response);
              resp.send("Password is sent to your email")
            }
          });
          
    });
});


