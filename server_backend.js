//#region  initializing Node Modules
//<script>alert('');window.location.href='';</script>
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const fileUpload = require("express-fileupload");
app.use(cookieParser());
app.use(fileUpload());
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Running Successfully on Port " + port);
});
app.use(bodyparser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
const mongodbOnlineUrl = "mongodb://damilola:connect@blogdb-shard-00-00.ahxoi.mongodb.net:27017,blogdb-shard-00-01.ahxoi.mongodb.net:27017,blogdb-shard-00-02.ahxoi.mongodb.net:27017/AccountsData?ssl=true&replicaSet=atlas-111cjk-shard-0&authSource=admin&retryWrites=true&w=majority";
const offlineUrl = "mongodb://localhost:27017/propress";
mongoose.connect(offlineUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const postSchema = {
    Title: String,
    Contents: String,
    Category: String,
    Slug: String,
    Thumbs: Number
}
const categorySchema = {
    Name: String,
    Slug: String
};

const menuSchema = {
    Text: String,
    Link: String,
    Type: String,
    Parent: String,
    Children: [String],
    isChild: Boolean
}
const MediaSchema = {
    Name: String,
    Type: String
}
const accountsSchema = {
    Name: String,
    Password: String,
    Email: String,
    AccountType: String,
    Link: String,
    ThemeColor: String,
    Template: String,
    TextShade: String,
    Posts: [postSchema],
    Categories: [categorySchema],
    Menu: [menuSchema],
    BackroundColor: String,
    PageLinkTextColor: String,
    CategoryHeaderColor: String,
    HomePageCaption: String,
    GeneralLinkColor: String,
    Media: [MediaSchema]
}

const Account = mongoose.model("account", accountsSchema)
const Theme = mongoose.model("theme", {
    Name: String,
    File: String,
    Sidebar: Boolean,
    Left: Boolean,
    Right: Boolean
});


app.get("/cssjs/bootstrap.css", function (req, res) {
    res.sendFile(__dirname + "/scripts_sheets/bootstrap.min.css");
});
app.get("/cssjs/bootstrap.js", function (req, res) {
    res.sendFile(__dirname + "/scripts_sheets/bootstrap.min.js");
});
app.get("/cssjs/jquery.js", function (req, res) {
    res.sendFile(__dirname + "/scripts_sheets/jquery.js");
});
app.get("/cssjs/clientLoginLayout.css", function (req, res) {
    res.sendFile(__dirname + "/scripts_sheets/loginlayout.css");
});
app.get("/cssjs/clientStyle.css", function (req, res) {
    res.sendFile(__dirname + "/scripts_sheets/cstyle.css");
});
//#endregion

//admin get requests
app.get("/accountLogin", function (req, res) {
    res.render("login/login", {
        page: "accountLogin",
        message: ""
    });

});

app.get("/admin", function (req, res) {
    // ThemeSettings:{
    //     BackroundColor:String,
    //     PageLinkTextColor:String,
    //     CategoryHeaderColor:String,
    //     HomePageCaption:String,
    //     GeneralLinkColor:String
    // }
    let accountId = req.cookies.accountHash;
    //if a cookie with the encrypted user id exists
    if (accountId != null) {
        Account.findOne({
            _id: accountId
        }, function (err, result) {
            if (!err) {
                if (result != null) {
                    //if user with cookie id exists
                    res.render("dashboardArea/home", {
                        userName: result.Name,
                        slug: result.Link,
                        theme: result.ThemeColor,
                        shade: result.TextShade,
                        userEmail: result.Email,
                        template: result.Template,
                        bgc: result.BackroundColor,
                        pl: result.PageLinkTextColor,
                        cl: result.CategoryHeaderColor,
                        cp: result.HomePageCaption,
                        gl: result.GeneralLinkColor
                    });
                } else {
                    //if no user with such id
                    res.render("login/login", {
                        page: "accountLogin",
                        error: "",
                        message: ""
                    });
                }
            } else {
                //if database has an error
                res.send("An error occured " + err);
            }

        });
    } else {
        //if no cookie at all
        res.render("login/login", {
            page: "accountLogin",
            error: "",
            message: ""
        });
    }

});

app.get("/admin/post", function (req, res) {
    let accountId = req.cookies.accountHash;
    //if a cookie with the encrypted user id exists
    if (accountId != null) {
        Account.findOne({
            _id: accountId
        }, function (err, result) {
            if (!err) {
                if (result != null) {
                    //if user with cookie id exists
                    //find all post under that user
                    Account.findById(accountId, function (err, results) {
                        if (!err) {
                            res.render("dashboardArea/posts", {
                                posts: results.Posts,
                                categories: result.Categories
                            });
                        } else {
                            res.render("dashboardArea/posts", {
                                posts: "There Was a database error while getting your posts",
                                categories: "Database Error"
                            });
                        }

                    });


                } else {
                    //if no user with such id
                    res.render("login/login", {
                        page: "accountLogin",
                        error: "",
                        message: ""
                    });
                }
            } else {
                //if database has an error
                res.send("An error occured " + err);
            }

        });
    } else {
        //if no cookie at all
        res.render("login/login", {
            page: "accountLogin",
            error: "",
            message: ""
        });
    }

});

app.get("/admin/menu", function (req, res) {
    let accountId = req.cookies.accountHash;
    //if a cookie with the encrypted user id exists
    if (accountId != null) {
        Account.findOne({
            _id: accountId
        }, function (err, result) {
            if (!err) {
                if (result != null) {
                    //if user with cookie id exists
                    //find all post under that user
                    Account.findById(accountId, function (err, results) {
                        if (!err) {
                            res.render("dashboardArea/menu", {
                                menuItems: results.Menu,
                                posts: results.Posts,
                                categories: result.Categories
                            });
                        } else {
                            res.render("dashboardArea/menu", {
                                menuItems: "There Was a database error while getting your Menu Settings",
                                posts: "There Was a database error while getting your Menu Settings",
                                categories: "There Was a database error while getting your Menu Settings"
                            });
                        }

                    });


                } else {
                    //if no user with such id
                    res.render("login/login", {
                        page: "accountLogin",
                        error: "",
                        message: ""
                    });
                }
            } else {
                //if database has an error
                res.send("An error occured " + err);
            }

        });
    } else {
        //if no cookie at all
        res.render("login/login", {
            page: "accountLogin",
            error: "",
            message: ""
        });
    }

});

app.get("/admin/categories", function (req, res) {
    let accountId = req.cookies.accountHash;
    //if a cookie with the encrypted user id exists
    if (accountId != null) {
        Account.findOne({
            _id: accountId
        }, function (err, result) {
            if (!err) {
                if (result != null) {
                    //if user with cookie id exists
                    //find all post under that user
                    Account.findById(accountId, function (err, results) {
                        if (!err) {
                            res.render("dashboardArea/category", {
                                categories: results.Categories
                            });
                        } else {
                            res.render("dashboardArea/category", {
                                categories: "There Was a database error while getting your posts"
                            });
                        }

                    });


                } else {
                    //if no user with such id
                    res.render("login/login", {
                        page: "accountLogin",
                        error: ""
                    });
                }
            } else {
                //if database has an error
                res.send("An error occured " + err);
            }

        });
    } else {
        //if no cookie at all
        res.render("login/login", {
            page: "accountLogin",
            error: ""
        });
    }
});

app.get("/admin/account", function (req, res) {
    res.render("dashboardArea/setting", {
        id: req.cookies.accountHash
    })
});
app.post("/admin/postEditor", function (req, res) {
    Account.findById(req.cookies.accountHash, function (err, result) {
        if (!err) {
            result.Posts.forEach(post => {
                if (post.id == req.body.id) {
                    res.render("dashboardArea/postEditor", {
                        post: post.Contents,
                        category: post.Category,
                        slug: post.Slug,
                        title: post.Title,
                        categories: result.Categories,
                        pId: post.id
                    });
                }
            });

        } else {
            res.render("login/login", {
                page: "accountLogin",
                error: ""
            });
        }
    })

});

//admin Posting Section

app.post("/login", function (req, res) {
    let user = req.body.username;
    let pass = req.body.password;
    //checking from database on account with the inserted values
    //user input passes all queries set cookie
    Account.findOne({
        Email: user
    }, function (err, result) {

        if (result == null) {
            //if no user exists with the inputed name
            res.render("login/login", {
                page: "accountLogin",
                error: "user",
                message: ""
            })
        } else {
            //if the passwords match
            //and there is a user
            if (result.Password == pass) {
                res.cookie("accountHash", result.id, {
                    maxAge: 1000 * 60 * 60 * 6,
                    signed: false,
                    path: "/"
                });
                res.redirect("/admin");

            } else {
                //there is a user but passwords dosenot match
                res.render("login/login", {
                    page: "accountLogin",
                    error: "pass",
                    message: ""
                })

            }
        }
    });
});

app.post("/changeBlogSettings", function (req, res) {
    let value = req.body.value;
    let type = req.body.type;
    let loggedIn;
    if (type == "b_name") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            Name: req.body.value
        }, {
            useFindAndModify: false
        }, function (err) {
            if (!err) {
                res.redirect("/admin");
            } else {
                res.send("There was an error Updating Your Blog Details Try again")
            }
        });
    }
    if (type == "b_link") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            Link: req.body.value
        }, {
            useFindAndModify: false
        }, function (err) {
            if (!err) {
                res.redirect("/admin");
            } else {
                res.send("There was an error Updating Your Blog Details Try again")
            }
        });
    }
    if (type == "b_theme") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            ThemeColor: req.body.value
        }, {
            useFindAndModify: false
        }, function (err) {
            if (!err) {
                res.redirect("/admin");
            } else {
                res.send("There was an error Updating Your Blog Details Try again")
            }
        });
    }
    if (type == "b_shade") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            TextShade: req.body.value
        }, {
            useFindAndModify: false
        }, function (err) {
            if (!err) {
                res.redirect("/admin");
            } else {
                res.send("There was an error Updating Your Blog Details Try again")
            }
        });
    }
});

app.post("/newPost", function (req, res) {
    let cookieId = req.cookies.accountHash;
    let accountAvailable = false;
    Account.findById(cookieId, function (err, result) {
        if (result != undefined) {
            accountAvailable = true;
        } else {
            accountAvailable = false;
        }

        if (accountAvailable) {
            Account.findById(cookieId, function (err, result) {
                const newPost = {
                    Title: req.body.title,
                    Contents: req.body.content,
                    Category: req.body.category,
                    Slug: req.body.link,
                    Thumbs: 0
                };

                result.Posts.push(newPost);
                result.save();
                res.redirect("/admin/post");

            });
        } else {
            res.send("<script>alert('Seems You Have Been Logged Out');window.location.href='/admin/post';</script>");
        }


    });


});

app.post("/newCategory", function (req, res) {
    let cookieId = req.cookies.accountHash;
    let accountAvailable = false;
    Account.findById(cookieId, function (err, result) {
        if (result != undefined) {
            accountAvailable = true;
        } else {
            accountAvailable = false;
        }

        if (accountAvailable) {
            Account.findById(cookieId, function (err, result) {
                const newCategory = {
                    Name: req.body.title,
                    Slug: req.body.link,
                };

                result.Categories.push(newCategory);
                result.save();
                res.redirect("/admin/categories");

            });
        } else {
            res.send("<script>alert('Seems You Have Been Logged Out');window.location.href='/admin/post';</script>");
        }


    });


});

app.post("/newMenuItem", function (req, res) {
    let cookieId = req.cookies.accountHash;
    let accountAvailable = false;
    let menuIndex = undefined;
    Account.findById(cookieId, function (err, result) {
        if (result != undefined) {
            accountAvailable = true;
        } else {
            accountAvailable = false;
        }

        if (accountAvailable) {
            Account.findById(cookieId, function (err, result) {

                if (req.body.type == "Page") {
                    const newItem = {
                        Text: req.body.name,
                        Link: result.Link + "/" + req.body.link,
                        Type: req.body.type,
                        isChild: false
                    };
                    result.Menu.push(newItem);
                    result.save();
                    res.redirect("/admin/menu");
                }
                if (req.body.type == "category") {
                    const newItem = {
                        Text: req.body.name,
                        Link: result.Link + "/categories/" + req.body.link,
                        Type: req.body.type,
                        isChild: false
                    };
                    result.Menu.push(newItem);
                    result.save();
                    res.redirect("/admin/menu");
                }
                if (req.body.type == "Static Link") {
                    const newItem = {
                        Text: req.body.name,
                        Link: req.body.link,
                        Type: req.body.type,
                        Parent: req.body.parent,
                        isChild: false
                    };
                    result.Menu.push(newItem);
                    result.save();
                    res.redirect("/admin/menu");
                }




            });
        } else {
            res.send("<script>alert('Seems You Have Been Logged Out');window.location.href='/admin/menu';</script>");
        }
    });
});
app.post("/setMenuChild", function (req, res) {
    let parent = req.body.parent;
    let child = req.body.child;
    Account.findById(req.cookies.accountHash, function (err, result) {
        result.Menu.forEach(menuItem => {
            let itemIndex = 0;
            let canAdd = true;
            for (let i = 0; i < result.Menu.length; i++) {
                if (result.Menu[i].Text == child) {
                    itemIndex = i;
                    break;
                }
            }
            if (menuItem.id == parent) {
                if (result.Menu[itemIndex].isChild == true) {
                    res.send("<script>alert('That is a child of another object to add remove it from that object');window.location.href='/admin/menu';</script>");
                }
                if (result.Menu[itemIndex].Children.length > 0) {
                    res.send("<script>alert('This One Has child(ren) under it remove it/them to add');window.location.href='/admin/menu';</script>");
                }
                if (result.Menu[itemIndex].isChild == false && result.Menu[itemIndex].Children.length === 0) {
                    menuItem.Children.push(child);
                    result.Menu[itemIndex].isChild = true;
                    res.redirect("/admin/menu");
                }
            }


        });
        result.save();

    });


});

app.post("/removeMenuChild", function (req, res) {
    let cookieId = req.cookies.accountHash;
    let accountAvailable = false;
    let mId = req.body.menuid;
    Account.findById(cookieId, function (err, result) {
        if (result != undefined) {
            accountAvailable = true;
        } else {
            accountAvailable = false;
        }

        if (accountAvailable) {
            result.Menu.forEach(item => {
                if (item.id == mId) {
                    item.isChild = false;
                }
                if (item.id == req.body.parentId) {
                    for (let index = 0; index < item.Children.length; index++) {
                        if (item.Children[index] == req.body.texty) {
                            let f = index - (-1);
                            item.Children.splice(index, f);
                            result.save();
                        }
                    }
                }

            });


            res.redirect("/admin/menu");
        } else {
            res.send("<script>alert('Seems You Have Been Logged Out');window.location.href='/admin/menu';</script>");
        }
    });
});

app.post("/delete", function (req, res) {
    Account.findById(req.cookies.accountHash, function (err, result) {
        if (!err) {
            if (req.body.type == "post") {
                for (let postIndex = 0; postIndex < result.Posts.length; postIndex++) {
                    var latterPostIndex = postIndex + 1;
                    if (result.Posts[postIndex].id == req.body.id) {
                        result.Posts.splice(postIndex, latterPostIndex);
                        break;
                    }
                }
                res.redirect("/admin/post");

            } else if (req.body.type == "category") {
                for (let catIndex = 0; catIndex < result.Categories.length; catIndex++) {
                    var latterCatIndex = catIndex + 1;
                    if (result.Categories[catIndex].id == req.body.id) {
                        result.Categories.splice(catIndex, latterCatIndex);
                        break
                    }
                }
                res.redirect("/admin/categories");
            } else if (req.body.type == "menu") {
                let candelete = true;
                result.Menu.forEach(menuItem => {
                    if (menuItem.id == req.body.id && menuItem.Children.length > 0) {
                        candelete = false;
                        res.send("<script>alert('Remove all submenus From This item in order to delete it');window.location.href='admin/menu';</script>");
                    }
                });
                for (let menuIndex = 0; menuIndex < result.Menu.length; menuIndex++) {
                    var lattermenuIndex = menuIndex + 1;
                    if (result.Menu[menuIndex].id == req.body.id) {
                        if (candelete) {
                            result.Menu.splice(menuIndex, lattermenuIndex);
                            res.redirect("/admin/menu");
                        } else {
                            //nothing to do excatly
                        }
                        break;
                    }
                }

            }
            result.save();

        } else {
            res.clearCookie("accountHash", {

            });
            res.send("<script>alert('Please Sign-In Again yoy Have Been Logged Out');window.location.href='/accountLogin';</script>");
        }

    });
});

app.post("/editPost", function (req, res) {
    Account.findById(req.cookies.accountHash, function (err, result) {
        if (!err) {
            result.Posts.forEach(post => {
                if (post.id == req.body.pid) {
                    post.Title = req.body.title,
                        post.Contents = req.body.content,
                        post.Slug = req.body.slug,
                        post.Category = req.body.category
                    result.save();
                    res.redirect("/admin/post");
                }
            });
        } else {
            res.redirect("/admin");
        }


    });
});
app.post("/deleteAccount", function (req, res) {
    Account.findByIdAndDelete(req.cookies.accountHash, {
        useFindAndModify: false
    }, function (err) {
        if (!err) {
            console.log("An Account was deleted Just now");
            res.redirect("/admin");
        } else {
            res.clearCookie("accountHash");
            res.send("There was an error processing Your Request Reload Page  to Sign-in Again");
        }
    })
});

app.get("/newAccount", function (req, res) {
    let emails = [];
    let slugs = [];
    let blognames = [];
    Account.find({}, function (err, result) {
        result.forEach(ress => {
            emails.push(ress.Email);
            slugs.push(ress.Link);
            blognames.push(ress.Name);
        });
    });
    res.render("login/new", {
        page: "login",
        error: "",
        message: "",
        emails: emails,
        links: slugs,
        blogs: blognames
    })
});

app.post("/editAcc", function (req, res) {

    let type = req.body.type;
    let value = req.body.color;
    if (type == "backgroundcolor") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            BackroundColor: value
        }, function (err) {
            if (!err) {
                console.log(value);
                res.redirect("/admin");
            } else {
                res.send("Database Error");
            }
        })
    }
    if (type == "pagecolor") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            PageLinkTextColor: value
        }, function (err) {
            if (!err) {
                console.log(value);
                res.redirect("/admin");
            } else {
                res.send("Database Error");
            }
        })
    }
    if (type == "lcolor") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            GeneralLinkColor: value
        }, function (err) {
            if (!err) {
                console.log(value);
                res.redirect("/admin");
            } else {
                res.send("Database Error");
            }
        })
    }
    if (type == "catlink") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            CategoryHeaderColor: value
        }, function (err) {
            if (!err) {
                console.log(value);
                res.redirect("/admin");
            } else {
                res.send("Database Error");
            }
        })
    }
    if (type == "caption") {
        Account.findByIdAndUpdate(req.cookies.accountHash, {
            HomePageCaption: value
        }, function (err) {
            if (!err) {
                console.log(value);
                res.redirect("/admin");
            } else {
                res.send("Database Error");
            }
        })
    }
});

app.post("/newAcc", function (req, res) {
    let newAcc = {
        Name: req.body.sitename,
        Email: req.body.email,
        Password: req.body.password,
        Link: req.body.slug,
        Template: "Elegance",
        ThemeColor: "hot-pink",
        BackroundColor: "white",
        PageLinkTextColor: "#0000cc",
        CategoryHeaderColor: "blue",
        HomePageCaption: req.body.sitename,
        GeneralLinkColor: "black",
        Media: [{
            Name: "DefaultIcon.png",
            Type: "image/png"
        }]

    }
    Account.insertMany(newAcc, function (err) {
        if (!err) {
            
           
            var a = setTimeout(() => {
                Account.findOne({
                    Name: req.body.sitename
                }, function (err, result) {
                    res.cookie("accountHash", result.id, {
                        maxAge: 1000 * 60 * 60 * 12,
                        signed: false,
                        path: "/"
                    });
                    fs.exists(__dirname + "/media/"+ req.cookies.accountHash, function (exists) {
                        if (!exists) {
                            fs.mkdir(__dirname + "/media/"+ req.cookies.accountHash, function (err) {
                                if (!err) {
                                    console.log("File created Successfully");
                                }
                                fs.copyFile("default.jpg", __dirname + "/media/"+req.cookies.accountHash+"/default_234_qwerty.jpg", function () {
                                    console.log("file Copies Successfully");
                                });
                            });
                        }
                    });
                    res.redirect("/admin");
                });
            }, 1000);
        } else {
            res.send("There was a database error try again");
        }
    })
});

app.post("/uploadPostImage",function(req,res){
    if(req.files.file.mimetype!="image/jpeg"){
        res.send("Only JPEGs are allowed");
    }else{
        res.send("Successful");
    }
    
    req.files.file.mv(uploadPath, function(err) {
        if (err) {
          return res.status(500).send(err);
        }
    
        res.send('File uploaded to ' + uploadPath);
      });
});
//client Section
app.get("/postimages/:source/:image", function (req, res) {
    Account.findOne({Name:req.params.source},function(err,result){
        if(!err){
            fs.exists(__dirname+"/media/"+result.id+"/"+req.params.image,function(exist){
                if(!exist){
                    res.sendFile(__dirname+"/default.jpg");
                }else{
                    res.sendFile(__dirname+"/media/"+result.id+"/"+req.params.image);
                }
            });
        }else{
            res.send("THERE WAS AN ERROR PROCESSING THE REQUESTS");
        }
    });
    
});

app.get("/:page", function (req, res) {
    let bloglink = req.params.page;
    Account.findOne({
        Link: bloglink
    }, function (err, result) {
        if (result == null) {
            res.send("Menn that blog does not exists")
        } else {
            console.log("Someone just requsted for : \n");
            console.log(result);
            //getting the theme the Blogpost uses
            Theme.findOne({
                Name: result.Template
            }, function (err, templateResult) {
                //render with that template
                if (templateResult != undefined) {
                    res.render("templates/" + templateResult.File, {
                        title: result.Name,
                        userEmail: result.Email,
                        posts: result.Posts,
                        categories: result.Categories,
                        page: "home",
                        Title: result.Name,
                        Parent: result.Link,
                        theme: result.ThemeColor,
                        shade: result.TextShade,
                        menu: result.Menu,
                        bgc: result.BackroundColor,
                        pl: result.PageLinkTextColor,
                        cl: result.CategoryHeaderColor,
                        cp: result.HomePageCaption,
                        gl: result.GeneralLinkColor,
                    });
                    console.log("Good day")
                } else {
                    Account.findByIdAndUpdate(result.id, {
                        Template: "Elegance"
                    }, function (err) {
                        if (!err) {
                            console.log("Theme problem rectified")
                        }
                    });
                }

            })

        }
    });
});

app.get("/:page/categories/:post", function (req, res) {
    let page = req.params.page;
    let post = req.params.post;
    Account.findOne({
        Link: page,
    }, function (err, result) {
        if (result == null) {
            res.send("You asked for a non existent blog");
        } else {
            //getting the theme the Blogpost uses
            Theme.findOne({
                Name: result.Template
            }, function (err, templateResult) {
                //render with that template
                if (templateResult != undefined) {
                    let postIndex = undefined;
                    for (let i = 0; i < result.Categories.length; i++) {
                        if (result.Categories[i].Slug == post) {
                            postIndex = i;
                            break;
                        }
                    }
                    if (postIndex != undefined) {
                        res.render("templates/" + templateResult.File, {
                            title: result.Categories[postIndex].Name,
                            userEmail: result.Email,
                            posts: result.Posts,
                            Parent: result.Link,
                            page: "a_blog_category",
                            Title: result.Name,
                            theme: result.ThemeColor,
                            shade: result.TextShade,
                            menu: result.Menu,
                            bgc: result.BackroundColor,
                            pl: result.PageLinkTextColor,
                            cl: result.CategoryHeaderColor,
                            cp: result.HomePageCaption,
                            gl: result.GeneralLinkColor
                        });
                    } else {
                        res.render("templates/" + templateResult.File, {
                            title: result.Name + "404",
                            userEmail: result.Email,
                            post: "404",
                            Parent: result.Link,
                            page: "404",
                            Title: result.Name,
                            theme: result.ThemeColor,
                            shade: result.TextShade,
                            menu: result.Menu,
                            bgc: result.BackroundColor,
                            pl: result.PageLinkTextColor,
                            cl: result.CategoryHeaderColor,
                            cp: result.HomePageCaption,
                            gl: result.GeneralLinkColor
                        });
                    }

                    console.log("Good day")
                } else {
                    Account.findByIdAndUpdate(result.id, {
                        Template: "Elegance"
                    }, function (err) {
                        if (!err) {
                            console.log("Theme problem rectified");
                        }
                    });
                }

            })

        }
    });
});

app.get("/:page/:post", function (req, res) {
    let page = req.params.page;
    let post = req.params.post;
    Account.findOne({
        Link: page,
    }, function (err, result) {
        if (result == null) {
            res.send("You asked for a non existent blog");
        } else {
            //getting the theme the Blogpost uses
            Theme.findOne({
                Name: result.Template
            }, function (err, templateResult) {
                //render with that template
                if (templateResult != undefined) {
                    let postIndex = undefined;
                    for (let i = 0; i < result.Posts.length; i++) {
                        if (result.Posts[i].Slug == post) {
                            postIndex = i;
                            break;
                        }
                    }
                    if (postIndex != undefined) {
                        res.render("templates/" + templateResult.File, {
                            title: result.Name,
                            userEmail: result.Email,
                            post: result.Posts[postIndex],
                            Parent: result.Link,
                            page: "a_blog",
                            Title: result.Name,
                            theme: result.ThemeColor,
                            shade: result.TextShade,
                            menu: result.Menu,
                            categories: result.Categories,
                            bgc: result.BackroundColor,
                            pl: result.PageLinkTextColor,
                            cl: result.CategoryHeaderColor,
                            cp: result.HomePageCaption,
                            gl: result.GeneralLinkColor
                        });
                    } else {
                        res.render("templates/" + templateResult.File, {
                            title: result.Name + "404",
                            userEmail: result.Email,
                            post: "404",
                            Parent: result.Link,
                            page: "404",
                            Title: result.Name,
                            theme: result.ThemeColor,
                            shade: result.TextShade,
                            menu: result.Menu,
                            bgc: result.BackroundColor,
                            pl: result.PageLinkTextColor,
                            cl: result.CategoryHeaderColor,
                            cp: result.HomePageCaption,
                            gl: result.GeneralLinkColor
                        });
                    }

                    console.log("Good day")
                } else {
                    Account.findByIdAndUpdate(result.id, {
                        Template: "Elegance"
                    }, function (err) {
                        if (!err) {
                            console.log("Theme problem rectified")
                        }
                    });
                }

            })

        }
    });
});