var dbconn = require('./Database/dbconn');

module.exports.addTwitter = function(req, res) {
    dbconn.addTwitter(req.body.socialContractId, req.body.authToken, req.body.authSecret,
        req.body.username, req.body.twitterId,  function(result) {
        res.send(result);
    });
}

module.exports.deleteTwitter = function(req, res) {
    dbconn.deleteTwitter(req.body.socialContractId, req.body.twitterId,  function(result) {
        res.send(result);
    });
}

module.exports.getTwitterAccounts = function(req, res) {
    dbconn.getTwitterAccounts(req.body.socialContractId, function(result) {
        res.send(result);
    });
}

module.exports.addFacebook = function(req, res) {
    dbconn.addFacebook(req.body.socialContractId, req.body.accessToken, req.body.facebookId, req.body.applicationId,
        function(result) {
        res.send(result);
    });
}

module.exports.deleteFacebook = function(req, res) {
    dbconn.deleteFacebook(req.body.socialContractId, req.body.facebookId, function(result) {
        res.send(result);
    });
}

module.exports.getFacebookAccounts = function(req, res) {
    dbconn.getFacebookAccounts(req.body.socialContractId, function(result) {
        console.log(req.body);
        console.log(res);
        res.send(result);
    });
}

module.exports.addInstagram = function(req, res) {
    dbconn.addInstagram(req.body.socialContractId, req.body.accessToken, req.body.instagramId,
        req.body.username, function(result) {
        res.send(result);
    });
}

module.exports.deleteInstagram = function(req, res) {
    dbconn.deleteInstagram(req.body.socialContractId, req.body.instagramId, function(result) {
        res.send(result);
    });
}

module.exports.getInstagramAccounts = function(req, res) {
    dbconn.getInstagramAccounts(req.body.socialContractId, function(result) {
        res.send(result);
    });
}

module.exports.addTwitterQueue = function(req, res) {
    dbconn.getCoins(req.body.socialContractId, function(result) {
        if(result.success) {
            var coins = result.coins;
            if(coins >= req.body.cost) {

                dbconn.addTwitterQueue(req.body.socialContractId, req.body.twitterId, req.body.goal,
                    req.body.type, req.body.mediaId, function(result) {
                        if (result.success) {
                            result.newCoinTotal = coins - req.body.cost;
                            var toSend = result;

                            dbconn.editCoins(req.body.socialContractId, coins - req.body.cost, function(result2) {
                                if (result2.success) {
                                    res.send(toSend);
                                } else {
                                    toSend.message = "Failed to update coins";
                                    res.send(toSend);
                                }
                            });

                        } else {
                            res.send(result);
                        }

                });

            } else {
                res.send({'success': false, 'message': 'Not enough coins'});
            }
        } else {
            res.send({'success': false, 'message': 'User does not exist'});
        }

    });
}

module.exports.addFacebookQueue = function(req, res) {
    dbconn.getCoins(req.body.socialContractId, function(result) {
        if(result.success) {
            var coins = result.coins;
            if(coins >= req.body.cost) {

                dbconn.addFacebookQueue(req.body.socialContractId, req.body.facebookId, req.body.goal,
                    req.body.type, req.body.mediaId, function(result) {
                        if (result.success) {
                            result.newCoinTotal = coins - req.body.cost;
                            var toSend = result;

                            dbconn.editCoins(req.body.socialContractId, coins - req.body.cost, function(result2) {
                                if (result2.success) {
                                    res.send(toSend);
                                } else {
                                    toSend.message = "Failed to update coins";
                                    res.send(toSend);
                                }
                            });

                        } else {
                            res.send(result);
                        }

                });

            } else {
                res.send({'success': false, 'message': 'Not enough coins'});
            }
        } else {
            res.send({'success': false, 'message': 'User does not exist'});
        }

    });
}

module.exports.addInstagramQueue = function(req, res) {
    dbconn.getCoins(req.body.socialContractId, function(result) {
        if(result.success) {
            var coins = result.coins;
            if(coins >= req.body.cost) {

                dbconn.addInstagramQueue(req.body.socialContractId, req.body.instagramId, req.body.goal,
                    req.body.type, req.body.mediaId, function(result) {
                        if (result.success) {
                            result.newCoinTotal = coins - req.body.cost;
                            var toSend = result;

                            dbconn.editCoins(req.body.socialContractId, coins - req.body.cost, function(result2) {
                                if (result2.success) {
                                    res.send(toSend);
                                } else {
                                    toSend.message = "Failed to update coins";
                                    res.send(toSend);
                                }
                            });

                        } else {
                            res.send(result);
                        }

                });

            } else {
                res.send({'success': false, 'message': 'Not enough coins'});
            }
        } else {
            res.send({'success': false, 'message': 'User does not exist'});
        }

    });
}

module.exports.addViewed = function(req, res) {
    type = req.body.type;
    if (type == 'TWITTER') {
        dbconn.insertViewedTwitter(req.body.socialContractId, req.body.mediaId, function(result) {
            res.send(result);
        });
    } else if (type == 'INSTAGRAM') {
        dbconn.insertViewedInstagram(req.body.socialContractId, req.body.mediaId, function(result) {
            res.send(result);
        });
    } else {
        res.send({'success': false, 'message': 'Type does not exist'});
    }
}

module.exports.deleteFromQueue = function(req, res) {
    type = req.body.type;
    if (type == 'TWITTER')  {
        dbconn.deleteFromTwitterQueue(req.body.requestId, function(result) {
            res.send(result);
        });
    } else if (type == 'INSTAGRAM') {
        dbconn.deleteFromInstagramQueue(req.body.requestId, function(result) {
            res.send(result);
        });
    } else {
        res.send({'success': false, 'message': 'Type does not exist'});
    }
}

module.exports.getDiscover = function(req, res) {
    type = req.body.type;
    if (type == 'TWITTER')  {
        dbconn.getDiscoverTwitter(req.body.socialContractId, function(result) {
            res.send(result);
        });
    } else if (type == 'INSTAGRAM') {
        dbconn.getDiscoverInstagram(req.body.socialContractId, function(result) {
            res.send(result);
        });
    } else {
        res.send({'success': false, 'message': 'Type does not exist'});
    }

}
