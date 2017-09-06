var React = require('react');
var queryString = require('query-string');
var api = require('../utils/api');
var Link = require('react-router-dom').Link;
var PropTypes = require('prop-types');
var PlayerPreview = require('./PlayerPreview');
var Loading = require('./Loading');

function Profile(props) {
	var info = props.info;

	return (

		<PlayerPreview avatar={info.avatar_url} username={info.login}>
			<ul className='space-list-items'>
				{info.name && <li>{info.name}</li>}
				{info.location && <li>{info.location}</li>}
				{info.company && <li>{info.company}</li>}
				<li>Followers: {info.followers}</li>
				<li>Following: {info.following}</li>
				<li>Public Repos: {info.public_repos}</li>
				{info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
			</ul>
		</PlayerPreview>

	)
}

Profile.propTypes = {
	info: PropTypes.object.isRequired
}

function Player(props){
	return(
		<div>
			<h1 className='header'>{props.label}</h1>
			<h3 style={{textAlign: 'center'}}>Score: {props.score}</h3>
			<Profile info={props.profile}/>
		</div>
	)
}

Player.propTypes={
	label: PropTypes.string.isRequired,
	score: PropTypes.number.isRequired,
	profile: PropTypes.object.isRequired
}

function Note(){
	return(
		<div className='row'>
		<p style={{textAlign: 'center'}}>
			<em>Note: Millennial developer believes there are only winners on Github</em>
		</p>
	</div>
	)
	
}

class Results extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			winner: null,
			secondWinner: null,
			error: null,
			loading: true
		}
	}

	componentDidMount(){
		var players = queryString.parse(this.props.location.search);

		api.battle([
			players.playerOneName,
			players.playerTwoName
			]).then(function(results) {
				if(results === null){
					return this.setState(function() {
						return {
							error: 'Looks like there was an error. Check that both users exist on Github',
							loading: false
						}
					});
				}

				this.setState(function(){
					return{
						error: null,
						winner: results[0],
						secondWinner: results[1],
						loading: false
					}
				});
			}.bind(this));
	}
	render() {
		var error = this.state.error;
		var winner = this.state.winner;
		var secondWinner = this.state.secondWinner;
		var loading = this.state.loading;

		if(loading === true) {
			return <Loading />}

		if(error){
			return (
				<div>
					<p>{error}</p>
					<Link to='/battle'>Reset</Link>
				</div>
			)
		}

		return (
			<div>
				<div className='row'>
				<Player
					label='Winner'
					score={winner.score}
					profile={winner.profile}
				/>

				<Player
					label='Second Winner'
					score={secondWinner.score}
					profile={secondWinner.profile}
				/>
				</div>
				<Note />
			</div>
		)
	}
}

module.exports = Results;