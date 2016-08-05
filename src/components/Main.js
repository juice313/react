"use strict";

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Main = React.createClass({
	getInitialState: function(){
			return {
				images: [{
					"id": 1,
					"user": 1,
					"photo": ""
				}]
			};
	},

	componentWillMount: function() {
		var self = this;
		$.ajax({
			url: 'http://127.0.0.1:8000/api/v1/photos/'
			, type: 'GET'
			, error: function(xhr, textStatus, errorThrown) {

			}
		}).then(function(data) {
            self.setState({images: data});
		});

	}

	, render: function() {
		var self = this;
		return (
			<div className="container">
				<div className="row">
					{self.state.images.map(function (item) {
						return (
						<div className="col-md-4 image-frame" key={item.id} >
							<a href={'#/photo/' + item.id}>
								<img src={'http://127.0.0.1:8000' + item.photo} id={'image-' + item.id} data-id={item.id} width="100%" height="100%"/>
							</a>
						</div>
						);
					})}
					</div>
				<button type="button" className="btn btn-primary btn-lg round-btn">+</button>
			</div>);
	}
});

module.exports = Main;