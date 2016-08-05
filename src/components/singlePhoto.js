"use strict";

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

//TODO:
//1. get user Name using user_id, to show on comments
//2. remember somewhere logged user to can add comments and likes.

var Photo = React.createClass({
	getInitialState: function(){
			return {
				imageLoaded: false,
				image: '',
				comments: [],
				likes: '',
                loggedUsername: ''
			};
	}

	, componentWillMount: function() {
		var self = this;
		$.ajax({
			url: 'http://127.0.0.1:8000/api/v1/photos/'
			, type: 'GET'
			, error: function(xhr, textStatus, errorThrown) {

			}
		}).then(function(data) {
			function findPhoto(img) {
				return img.id === parseInt(self.props.params.photo_id);
			}
            self.setState({imageLoaded: true});
			self.setState({image: data.find(findPhoto)});

			$.ajax({
			url: 'http://127.0.0.1:8000/api/v1/photos/' + self.state.image.id + '/comments/'
			, type: 'GET'
			, error: function(xhr, textStatus, errorThrown) {
			}
			}).then(function(commentData) {
				self.setState({comments: commentData});
			});


			$.ajax({
			url: 'http://127.0.0.1:8000/api/v1/photos/' + self.state.image.id + '/like/'
			, type: 'GET'
			, error: function(xhr, textStatus, errorThrown) {
			}
			}).then(function(likesData) {
				self.setState({likes: likesData});
			});

            $.ajax({
			url: 'http://127.0.0.1:8000/api/v1/users/'
			, type: 'GET'
			, error: function(xhr, textStatus, errorThrown) {

			}
			}).then(function(userData) {
				function findUser(usr) {
					return usr.id === parseInt(sessionStorage.getItem('user_id'));
				}

				//search user by specific ID in list resulted from ajax for user
				function findUserByID(userID){
					for(var i = 0; i <= userData.length; i++){
						if(userData[i].id === userID) {
							return userData[i].username;
						}
					}
				}

				var user = userData.find(findUser);
				if(user != null) {self.setState({loggedUsername: user.username}); }

				var newCommentObj = self.state.comments;
				self.state.comments.map(function (item, index) {
					var userID = item.user;
					newCommentObj[index] = {comment: item.comment, user: findUserByID(userID)};
				});
					self.setState({comments: newCommentObj});

				});

			if(sessionStorage.getItem('photoPageReloaded') == null) {
						sessionStorage.setItem('photoPageReloaded', true);
						window.location.reload();
					}


		});
	},

	onCommentHandler: function(event) {
		event.preventDefault();

		//var id = event.target.id;
		var self = this;

		var params = {comment: $('#commentContent').val(), photo: self.state.image.id, user: sessionStorage.getItem('user_id')};
		$.ajax({
			url: 'http://127.0.0.1:8000/api/v1/photos/' + self.state.image.id + '/comments/'
			, type: 'POST'
			, data: params
			, error: function(xhr, textStatus, errorThrown) {

			}
		}).then(function(data) {
			window.location.reload();
		});
	}
    , onLikeHandler: function(event) {
		event.preventDefault();

		var self = this;
		var token = sessionStorage.getItem('authToken');
		var params = {photo: self.state.image.id, user: sessionStorage.getItem('user_id')};
		$.ajax({
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization', 'Token ' + token);
			}
			, url: 'http://127.0.0.1:8000/api/v1/photos/' + self.state.image.id + '/like/'
			, type: 'POST'
			, data: params
			, error: function(xhr, textStatus, errorThrown) {

			}
		}).then(function(data) {
			window.location.reload();
		});
	},

	render: function() {
		var self = this;
		//debugger;
		return (
			<div>
				{sessionStorage.getItem('authToken') != null ? <span className="userLogedLabel">Hello {self.state.loggedUsername}</span> : ''}
			<div className="container">
				<div className="row">
					<div className="col-md-5">
						<img className="img-rounded photo-img" src={'http://127.0.0.1:8000' + self.state.image.photo} width="100%" />
                        <span className="like-icon glyphicon glyphicon-thumbs-up" onClick={self.onLikeHandler}></span>
                        <span className="like-label">{self.state.likes}</span>
					</div>
					<div className="col-md-7 well">
						<h1>Comments</h1>
						{self.state.comments.map(function (item) {
							return (
							<div >
								<h5><b>{item.user} said: </b><i>{item.comment}</i></h5>
							</div>
							);
						})}
						{self.state.comments.length === 0 ? <div>No comments</div> : ''}

                        {sessionStorage.getItem('authToken') != null ? <textarea placeholder="Add Comment" className="form-control" id="commentContent"/> : ''}
                        {sessionStorage.getItem('authToken') != null ? <button className="btn btn-default col-sm-offset-3 col-sm-9" name="submit" onClick={self.onCommentHandler}>Add</button> : '' }


					</div>

				</div>

			</div>;
            </div>
        );

	}
});

module.exports = Photo;
