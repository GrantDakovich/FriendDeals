const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoose = require('mongoose');

const deal_pool_model = mongoose.model('deal_pool_model', {
	deal: {
		code: String,
		savings: Number
	},
	users: {
		init_user: {
			time_accessed: Number,
			username: String,
			carddetails: {
				name_on_card: String,
				card_number: String,
				expiration_month: Number,
				expiration_year: Number,
				cvv: String
			}
		},
		other_users: [{
			time_accessed: Number,
			username: String,
			carddetails: {
				name_on_card: String,
				card_number: String,
				expiration_month: Number,
				expiration_year: Number,
				cvv: String
			}
		}]
	}
}, 'deal_pool');

db_url = "mongodb://heroku_41l8p2qn:qhh1muq9tg5h56m711ek0fsa5q@ds157136.mlab.com:57136/heroku_41l8p2qn";

const deepCopyFunction = inObject => {
  let outObject, value, key

  if(typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
  }
  
  return outObject
}

const getNextDeal = (requesting_user, callback) => {
	console.log("REQUESTING USER: " + requesting_user);
	mongoose.connect(db_url + '/frienddeals',{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	});

	deal_pool_model.findOne({time_allocated: 0}, (err, data) => {
		//data.time_allocated = (new Date()).getTime();
		deal_pool_model.updateOne(data, {$set: {username: requesting_user, time_allocated: (new Date()).getTime()}}, () => {
			callback(data);
			mongoose.connection.close();
		})
	})
}

const refreshDealCodes = (callback) => {
	mongoose.connect(db_url + '/frienddeals',{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	});

	deal_pool_model.updateMany({}, {$set: {initfriendtime: 0, recfriendtime: 0, username:""}},()=>{
		mongoose.connection.close();
	});
}

const friendAddingCode = (friend_code, callback) => {
	mongoose.connect(db_url + '/frienddeals',{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	});

	deal_pool_model.findOne({code: friend_code}, (err, data) => {
		// TODO: More advanced checks for time_allocated
		// TODO: Also check if the person is friends with you
		if (data){
			if (data.initfriendtime != 0){
				if (data.recfriendtime == 0) {
					// Add our username
					// Friend requests to pay here
					// After payment request, send a response to the other open thread
					deal_pool_model.updateOne(data, {$set: {recfriendtime: (new Date()).getTime()}},()=>{
						mongoose.connection.close();
					});
					callback("code found, successful submission");
				}
				else {
					callback("this code was already used by a friend");
				}
			} else{
				callback("the deal was never initialized by a friend");
			}
		} else{
			callback("code not found");
		}

		mongoose.connection.close();
	})	
}

const fillWithData = () => {
	mongoose.connect(db_url + '/frienddeals',{
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	});

	var codes = ["fsamfe32","faeio3332","mwc32302d","fia30fjc","wfn32ins","faw329cs","f39q3jef","32q3q22","weijd23","32ifdcn32","f3i20ssw","w0ejww3","weidxw32","wef03wes","aksaww33"];

	var doc_template = {
					deal: {
						code: "", 
						savings: 5
					},
					users:{
						init_user: {
							time_accessed: null,
							username: "",
							carddetails: {
								name_on_card: "",
								card_number: "",
								expiration_month: null,
								expiration_month: null,
								cvv: ""
							}
						},
						other_users: [{
							time_accessed: null,
							username: "",
							carddetails: {
								name_on_card: "",
								card_number: "",
								expiration_month: null,
								expiration_month: null,
								cvv: ""
							}
						}]
					}
				};

	var docs = [];
	for (let i = 0; i < codes.length; i++) {
		doc_template.deal.code = codes[i];
		docs.push(deepCopyFunction(doc_template));
	}
	
	
	deal_pool_model.insertMany(docs, function(err, res) {
		if (err) throw err;
		//console.log(res.insertedCount + " documents inserted");
		mongoose.connection.close();
	})

}





exports.getNextDeal = getNextDeal;
exports.refreshDealCodes = refreshDealCodes;
exports.friendAddingCode = friendAddingCode;
exports.fillWithData = fillWithData;












