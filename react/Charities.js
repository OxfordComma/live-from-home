import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import ReactTable from './Table.js'
import * as d3 from "d3";

class Gibbstack extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			charities: [{}]
		};

		this.onClickRow = this.onClickRow.bind(this)
		// this.onClickAlbum = this.onClickAlbum.bind(this)
		// this.getUniqueItems = this.getUniqueItems.bind(this)
		
	}
	// getLegendItems (data) {
	// 		return this.getUniqueItems(data, this.state.legendBy)
	// }

	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))]
	}

	componentDidMount() {
		var dataUrl = "/charities.csv"

		d3.csv(dataUrl).then(data => {//, (err, data) => {
			var charities = data
			console.log(charities)
				
			this.setState({ 
				charities: charities
			})
		});
	}

	onClickRow(event) {
			// console.log('legend click')
			// var id = event.currentTarget.id
			// console.log(id)
			// var datum = this.state.data.filter(d => d['track'] == id)[0]
			// console.log(datum)
			// var url = datum.url + '&t=' + datum.timestamp
			// console.log(url)
			// window.open(url, '_blank')
	}

	// onClickAlbum(event) {
	// 	var album = event.currentTarget.getAttribute('album')
	// 	var selectedAlbum
	// 	var albumsWithArt

	// 	if (this.state.selectedAlbum == null) {
	// 		selectedAlbum = album
	// 		albumsWithArt = this.state.albumsWithArt.map(d => {
	// 			// console.log(d)
	// 			if (album == d['key'])
	// 				d.selected = true
	// 			else
	// 				d.selected = false
	// 			return d
	// 		})
	// 	}
	// 	else {
	// 		selectedAlbum = null
	// 		albumsWithArt = this.state.albumsWithArt.map(d => {
	// 			d.selected = true
	// 			return d
	// 		})
	// 	}

	// 	console.log(album)

	// 	this.setState({
	// 		selectedAlbum: selectedAlbum,
	// 		albumsWithArt: albumsWithArt
	// 	})
	// }

	

	render() {
		return (
			<div id='container' className='charities'>
				<div id='header'>
					<span className='title'>Ben Gibbard: Live From Home</span>
					<div className='navbar'>
						<Navbar/>
					</div>
				</div>
				<div id='table' className='charities'>
					<Table 
						data={this.state.charities} 
						keyBy={'charity'} 
						headers={['charity', 'url', 'donate']}
						onClickRow={this.onClickRow}
						/>
				</div>
				<div id='albumart'>
					{
						this.state.charities.map(d => 
						<AlbumArt 
							key={d['charity']} 
							datum={d['charity']}
							isSelected={this.state.selectedAlbum==d['album']}
							url={d['url']}
							/>
					)}
				
				</div>
			</div>

		) 
	}
}
function AlbumArt(props) {
	// console.log(props.data)
	// var d = props.album
	return (
		<a href={props.url} target='_blank' rel='noopener noreferrer'>
			<img 
				key={props.datum}
				src={'/' + props.datum + '.png'}
				// album={d.key} 
				// onClick={props.onClick} 
				// style={{'width': props.isSelected ? '50%' : '100%'}}
				/>
		</a>)
}

function Table(props) {
	return (
		<table>
			<thead>
				<th>charity</th>
				<th></th>
				<th></th>

			</thead>
			<tbody>
			{props.data.map(d => {
				return (
					<tr key={d[props.keyBy]}>
						<td>{ d[props.headers[0]]} </td>
						<td><a href={d[props.headers[1]] } target='_blank' rel='noopener noreferrer'>website</a></td>
						<td><a href={d[props.headers[2]] } target='_blank' rel='noopener noreferrer'>donate</a></td>
					</tr>
				)}
			)}

			</tbody>
		</table>
	)
}

function Navbar(props) {
	return (
		<ul className='navbar-nav'>
			<li>
				<a href='/' className='navbar-link'>
					<span className='link-text'>Listen</span>
				</a>
			</li>
			<li>
				<a href='/charities' className='navbar-link'>
					<span className='link-text'>Help Out</span>
				</a>
			</li>
		</ul>
	)
}


// Render application
ReactDOM.render(
	<ErrorBoundary>
		<Gibbstack />
	</ErrorBoundary>,
	document.getElementById('root')
);


