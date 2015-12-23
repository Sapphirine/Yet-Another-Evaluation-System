var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	//database define.
var UserSchema = new Schema({
	userName:String,
	password:String,
	userCreateTime:{type:Date},
	superuser:Boolean,
	expired:Boolean

});

UserSchema.methods.Register = function(callback){
	console.log(this.userName);
	var that = this;
	this.model('User').findOne({userName:this.userName}, function(err, kitten){
		if(err){
			callback(0, err);
		}
		if(kitten){
		
			callback(0, "username has been registered.");
		}
		else
		{
			console.log(this);
			that.save(function(err){
				if(err){
					callback(0, "save user error.");
				}
				callback(1, that);
			});
		}
	});
}

UserSchema.methods.Login = function(callback){
	var that = this;
	this.model('User').findOne({userName:that.userName}, function(err, kitten){
		if(err){
			callback(0, err);
		}
		if(kitten){
			if(kitten.password === that.password){
				callback(1, kitten);
			}
			else{
				callback(0, 'password error.');
			}

		}
		else
		{
			callback(0, 'user doesn\'t exist.');
		}
	});
}

UserSchema.statics.Calculate = function(callback){
	var that = this;
    var query = that.where({'expired':false});
    var userArray = new Array();
	query.exec(function(err, userList){
		if(err){
			callback(0, err);
			return;
		}
		var index = 0;
		var count = userList.length;
		var calculate = function(){
			if(index < count)
			{
				var user = userList[index];
                var userObject = user._doc;
				user.model('Pic').count({'createUser':user.userName}, function(err, count){
					if(err){
						callback(0, err);
						return;
					}
					userObject["createImageCount"] = count;
					user.model('Pic').count({'labelPointUser': user.userName}, function(err, count){
						if(err){
							callback(0, err);
							return;
						}
						userObject["labelPointCount"] = count;
						user.model('Pic').count({'labelShoulderUser':user.userName}, function(err, count){
							if(err){
								callback(0, err);
								return;
							}
							userObject["labelShoulderCount"] = count;

							user.model('Pic').count({'validateUser':user.username}, function(err, count){
								if(err){
									callback(0, err);
									return;
								}
								userObject["checkCount"] = count;

                                user.model('Pic').count({'validateUser':{$ne:null}, 'labelPointUser':user.username}, function(err, count){
                                    if(err){
                                        callback(0, err);
                                        return;
                                    }
                                    userObject["validateCount"] = count;
                                    index ++;
                                    userArray.push(userObject);
                                    calculate();
							});
                            });
						});
					});
				});


			
			}
			else
			{
				callback(1, userArray);
				return;
			}

		}
        calculate();


	});

}

//
UserSchema.statics.GetUserInfo = function(userId, callback){
    var that = this;
    var query = that.where({'expired':false});
    this.findById(userId, function(err, user){
       if(err){
           callback(0, err);
            return;
       }
       if(!user){
            callback(0, "user doesn't exist.");
           return;
       }
        var calculate = function(){
            var userObject = user._doc;
            user.model('Pic').count({'createUser':user.userName}, function(err, count){
                if(err){
                    callback(0, err);
                    return;
                }
                userObject["createImageCount"] = count;
                user.model('Pic').count({'labelPointUser': user.userName}, function(err, count){
                    if(err){
                        callback(0, err);
                        return;
                    }
                    userObject["labelPointCount"] = count;
                    user.model('Pic').count({'labelShoulderUser':user.userName}, function(err, count){
                        if(err){
                            callback(0, err);
                            return;
                        }
                        userObject["labelShoulderCount"] = count;
                        user.model('Pic').count({'validateUser':user.userName}, function(err, count){
                            if(err){
                                callback(0, err);
                                return;
                            }
                            userObject["validateCount"] = count;
                            user.model('Pic').count({'labelPointUser':user.userName, 'status':4}, function(err, count){
                                if(err){
                                    callback(0, err);
                                    return;
                                }
                                userObject['checkCount'] = count;
                                callback(1, userObject);

                            });
                            //callback(1, userObject);



                        });

                    });
                });
            })
        }
        calculate();




    });







}

mongoose.model('User', UserSchema);



var PicSchema = new Schema({
	picUrl_s:String,
	picUrl_m:String,
	picUrl_l:String,
	picUrl:String,
	picAtOriginX:Number,
	picAtOriginY:Number,
	createUser:String,
	createTime:{type:Date},
	labelPointUser:String,
	labelPointTime:{type:Date},
	labelPosUser:String,
	labelPosTime:{type:Date},
	labelShoulderUser:String,
	labelShoulderTime:{type:Date},
	validateUser:String,
	validateTime:{type:Date},
	status:Number,/*status=0, Unlabeled, status = 1, Distributed, status=2, LabelButNoValidate, status = 3, LabelAndDistrubuted, status = 4, labelAndAccept, status = 5, labelButRejected. status = 6, trash, delete.*/
	expireTime:{type:Date}

});

PicSchema.statics.Trash = function(picId, userId, callback){
    var that = this;
    that.findById(picId, function(err, kitten){
       if(err){
           callback(0, err);
           return;
       }
        if(kitten){
            kitten.model('User').findById(userId, function(err, user){
               if(err){
                   callback(0, err);
                   return;
               }
               if(user){
                    kitten.validateUser = user.userName;
                    kitten.status = 6;
                   kitten.save(function(err){
                       if(err){
                           callback(0, err);
                           return;
                       }
                       callback(1, 'success');
                   });
               }
                else{
                   callback(0, 'cannot find user.');
               }
            });
        }
        else{
            callback(0, 'cannot find image');
        }
    });
}
PicSchema.statics.AskImage= function(num, expiredtime, callback){
    var dateNow = new Date(Date.now());
    console.log(dateNow);
	var query = this.where({status:1}).where('expireTime').lte(dateNow);
	//query.setOptions({overwrite:true});
    var that = this;
    /*query.exec(function(err, list){
       console.log(list.length);
    });*/
	this.update(query,{status:0}, {multi:true},function(err, result){
		if(err){
			callback(0, 'update query error.');
		}
		else{
			that.where({status:0}).limit(num).exec(function(err, imagelist){

				if(err){
					console.log(err);
					callback(0, 'select image error.');

				}
				else
				{
					var time = new Date(Date.now());
					time.setMinutes(time.getMinutes() + expiredtime);
                    var Count = imagelist.length;
                    var index = 0;
                    var saveImage = function(){
                        item = imagelist[index];
                        item.expireTime = time;
                        console.log(time);
                        item.status = 1;
                        index ++;
                        item.save(function(err){
                            if(err){
                                callback(0, 'update pic status error.');
                            }
                            else{
                                if(index < Count)
                                {
                                    saveImage();
                                }
                                else
                                {
                                    callback(1, imagelist);
                                }
                            }

                        })

                    };
                    saveImage();

					
				}

			});
		}


	});
	 


}

PicSchema.statics.AskForValidate = function(num, expiredtime, callback){
    var dateNow = new Date(Date.now());
    console.log(dateNow);
    var query = this.where({status:3}).where('expireTime').lte(dateNow);
    //query.setOptions({overwrite:true});
    var that = this;
    /*query.exec(function(err, list){
     console.log(list.length);
     });*/
    this.update(query,{status:2}, {multi:true},function(err, result){
        if(err){
            callback(0, 'update query error.');

        }
        else{
            that.where({status:2}).limit(num).exec(function(err, imagelist){

                if(err){
                    console.log(err);
                    callback(0, 'select image error.');

                }
                else
                {
                    var time = new Date(Date.now());
                    time.setMinutes(time.getMinutes() + expiredtime);
                    var Count = imagelist.length;
                    var index = 0;
                    var returnArray = new Array();
                    if(Count == 0){
                        callback(1, []);
                        return;
                    }
                    var saveAndInsertLabelImage = function(){
                        if(index < Count) {
                            var item = imagelist[index];
                            item.expireTime = time;
                            console.log(time);
                            item.status = 3;
                            var obj = item._doc;
                            index++;
                            item.save(function (err) {
                                if (err) {
                                    callback(0, 'update pic status error.');
                                }
                                else {
                                    item.model("Label").findOne({picId: item.id}, function (err, kitten) {
                                        if (err) {
                                            callback(0, err);
                                            return;
                                        }
                                        if (kitten) {
                                            obj["label"] = kitten._doc;
                                            returnArray.push(obj);
                                        }
                                        if (index < Count) {
                                            saveAndInsertLabelImage();
                                        }
                                        else {
                                            callback(1, returnArray);
                                        }


                                    });


                                }

                            });
                        }

                    }
                    saveAndInsertLabelImage();


                }

            });
        }


    });
}

PicSchema.statics.Validate = function(picId, userId,validated, callback){
	var that = this;
	this.findById(picId, function(err, kitten){
		if(err){
			callback(0, err);
			return;
		}
		if(kitten){
            kitten.model('User').findById(userId, function(err, user){
                if(err){
                    callback(0, err);
                    return;
                }
                if(user){
                    var dateNow = new Date(Date.now());
                    if(kitten.expireTime < dateNow){
                        callback(0, "validate time expired.")
                        return;
                    }
                    else
                    {
                        if(validated == "true"){
                            kitten.status = 4;
                        }
                        else
                        {
                            //kitten.status = 5;  Go back to label
                            kitten.status = 0;
                            // delete the label yi jue hou huan
                            that.model('Label').remove({picId: picId}, function (err, kitten) {
                                if (err) {
                                    callback(0, err);
                                    return;
                                }
                                if (kitten) {

                                }

                            });
                        }
                        kitten.validateUser = user.userName;
                        kitten.validateTime = Date.now();
                        kitten.save(function(err){
                            if(err){
                                callback(0, err);
                                return;
                            }
                            else
                            {
                                callback(1, kitten);
                            }
                        });
                    }

                }
                else
                {
                    callback(0, 'cannot find user');
                }
            });

		}
	});

}
PicSchema.statics.Filter= function(type, count, skipNum, callback){
    var dateNow = new Date(Date.now());
	var query = this.where({status:1}).where('expireTime').lte(dateNow);
	//query.setOptions({overwrite:true});
    var that = this;
    /*query.exec(function(err, list){
       console.log(list.length);
    });*/
	this.update(query,{status:0}, {multi:true},function(err, result){
		if(err){
			callback(0, err);
			return;
		}
		var queryValidate = that.where({status:3}).where('expireTime').lte(dateNow);
		that.update(queryValidate, {status:2}, function(err, validateList){
			if(err){
				callback(0, err);
				return;
			}
            var queryImage;
            if(type == -1)
            {
                queryImage = that.where({});
            }
            else
            {
                if (type == 2){
                    queryImage = that.where({$or:[{status:2},{status:3}]});
                }else{
                    queryImage = that.where({status:type});
                }

            }

			queryImage.skip(skipNum).limit(count).exec(function(err, imgList){

			if(err){
				callback(0, err);
				return;
			}
			if(type< 2 || type == 6){
				callback(1, imgList);
                return;
			}
			else
			{
				var index = 0;
				var count = imgList.length;
				var returnList = new Array();
				var AddLabel = function(){
					if(index < count){
						var img = imgList[index];
						var obj = img._doc;
						img.model("Label").findOne({picId: img.id}, function(err, kitten){
							if(err){
								callback(0, err);
								return;
							}
							if(kitten){
								obj["label"] = kitten._doc;
								returnList.push(obj);

							}
							index ++;
							AddLabel();
						});


					}
					else
					{
						callback(1, returnList);

					}

				}
				AddLabel();


			}

		});
		});

	});

}
PicSchema.statics.Statistics = function(callback){
   var that = this;
   var result = {};
   that.count({}, function(err, count) {
       if(err)
       {
           callback(0, err);
           return;
       }
       else
       {
           result['totalCount'] = count;
           that.count({status:2}, function(err, count){
              if(err){
                  callback(0, err);
                  return;
              }
              else
              {
                  result["labelCount"] = count;
                  that.count({status:4}, function(err, count){
                     if(err){
                         callback(0, err);
                         return;
                     }
                     else
                     {
                         result["checkCount"] = count;
                         that.count({status:0}, function(err, count){
                             if(err){
                                 callback(0, err);
                             }
                             else
                             {
                                 result["undoneCount"] = count;
                                 callback(1, result);
                             }
                         })

                     }
                  });
              }
           });
       }
   });
}

var Pic = mongoose.model('Pic', PicSchema);
var ResultSchema = new Schema({
	expId:String,
	epoch:Number,
	trainRate:Number,
	testRate:Number
});
var Result = mongoose.model('Result', ResultSchema);
var ErrorSchema = new Schema({
	picId:String,
	errorUser:String,
	errorType:String
});
var Error = mongoose.model('Error', ErrorSchema);
var ExpSchema = new Schema({
	expTime:{type:Date},
    picNum:Number,
	epochs:Number,
	learningRate:Number,
	minLearningRate:Number,
    weightDecayFactor:Number,
    momentum:Number,
    batchsize:Number,
    initialAverageLoss:Number,
    decayFactor:Number,
    dae:Number,
    weightSaveThreshold:Number,
    distortion:Boolean,
    distortionPerEpoch:Number,
    severityFactor:Number,
    maximumScaling:Number,
    maximumRotation:Number,
    elasticSigma:Number,
    elasticScaling:Number
	//remain to compeleted.

});
var Exp = mongoose.model('Exp', ExpSchema);
var LabelSchema = new Schema({
	picId:String,
	labelType:String,
	labeler:String,
	leftShoulderX:Number,
	leftShoulderY:Number,
	leftMiddleShoulderX:Number,
	leftMiddleShoulderY:Number,
	leftNeckX:Number,
	leftNeckY:Number,
	rightShoulderX:Number,
	rightShoulderY:Number,
	rightMiddleShoulderX:Number,
	rightMiddleShoulderY:Number,
	rightNeckX:Number,
	rightNeckY:Number,
	chinX:Number,
	chinY:Number,
	noseX:Number,
	noseY:Number,
	position:Boolean,
	shoulderType:Boolean,
	valid:Boolean
});

var FaceSchema = new Schema({
    picId:String,
    leftEyeX:Number,
    leftEyeY:Number,
    rightEyeX:Number,
    rightEyeY:Number,
    noseX:Number,
    noseY:Number,
    leftMouthX:Number,
    leftMouthY:Number,
    RightMouthX:Number,
    RightMouthY:Number,
    ChinX:Number,
    ChinY:Number
});
var Face = mongoose.model('Face', FaceSchema);


LabelSchema.methods.LabelPicture = function(callback){
	var that = this;
	that.model('Pic').findById(that.picId, function(err, picture){
        if(err){
			callback(0, err);
			return;
		}
		
		
        if(picture) {
        	var dateNow = new Date(Date.now());
        	if(picture.expireTime < dateNow|| picture.status != 1){
        		callback(0, "picture status error or you upload is expired.");
                return;
        	}
            that.model('Label').findOne({picId: that.picId}, function (err, label) {
                if (err) {
                    callback(0, err);
                    return;
                }

                if (label) {
                    var keys = ["leftShoulderX", "leftShoulderY", "leftMiddleShoulderX", "leftMiddleShoulderY", "leftNeckY", "leftNeckX", "rightShoulderX", "rightShoulderY", "rightMiddleShoulderX", "rightMiddleShoulderY", "rightNeckX", "rightNeckY", "labeler"];
                    var isContainAllKeys = true;
                    for (var type in keys) {
                        if (that[keys[type]] === undefined) {
                            isContainAllKeys = false;
                            break;
                        }
                    }
                    console.log(picture);
                    if (isContainAllKeys) {
                        for (var type in keys) {
                            label[keys[type]] = that[keys[type]];
                        }
                        picture.labelPointUser = that["labeler"];
                        picture.labelPointTime = Date.now();
                    }
                    console.log(label);
                    console.log(isContainAllKeys);
                    picture.labelPointUser = that["labeler"];
                    picture.labelPointTime = Date.now();
                    if (that['position'] !== undefined) {
                        label['position'] = that['position'];
                        picture.labelPosUser = that["labeler"];
                        picture.labelPosTime = Date.now();
                    }
                    if (that['shoulderType'] !== undefined) {
                        label['shoulderType'] == that['shoulderType'];
                        picture.labelShoulderUser = that["labeler"];
                        picture.labelShoulderTime = Date.now();
                    }
                    label['valid'] = true;
                    picture.status = 2;
                    label.save(function (err, label) {
                        if (err) {
                            callback(0, err);
                            return;
                        }
                        picture.status = 2;
                        picture.save(function (err, picture) {
                            if (err) {
                                callback(0, err);
                                return;
                            }
                            callback(1, label);

                        });

                    });


                }
                else {
                    var Label = that.model('Label');
                    label = new Label();
                    label['valid'] = true;
                    label['picId'] = that.picId;
                    var keys = ["leftShoulderX", "leftShoulderY", "leftMiddleShoulderX", "leftMiddleShoulderY", "leftNeckY", "leftNeckX", "rightShoulderX", "rightShoulderY", "rightMiddleShoulderX", "rightMiddleShoulderY", "rightNeckX", "rightNeckY", "labeler", "labelType"];
                    var isContainAllKeys = true;
                    for (var type in keys) {
                        if (that[keys[type]] === undefined) {
                            isContainAllKeys = false;
                            break;
                        }
                    }
                    if (isContainAllKeys) {
                        for (var type in keys) {
                            label[keys[type]] = that[keys[type]];
                        }
                        picture.labelPointUser = that["labeler"];
                        picture.labelPointTime = Date.now();


                    }
                    picture.status = 2;
                    if (that['position'] !== undefined) {
                        label['position'] = that['position'];
                        picture.labelPosUser = that["labeler"];
                        picture.labelPosTime = Date.now();
                    }
                    if (that['shoulderType'] !== undefined) {
                        label['shoulderType'] == that['shoulderType'];
                        picture.labelShoulderUser = that["labeler"];
                        picture.labelShoulderTime = Date.now();
                    }
                    label.save(function (err, label) {
                        if (err) {
                            callback(0, err);
                            return;
                        }
                        picture.save(function (err, picture) {
                            if (err) {
                                callback(0, err);
                                return;
                            }
                            callback(1, label);

                        });

                    });
                }

            });
        }

	});


}

var Label = mongoose.model('Label', LabelSchema);




