import React from 'react'
import ReactDOM from 'react-dom'
import ErrorBoundary from './ErrorBoundary.js'
import ReactTable from './Table.js'
import * as d3 from "d3";

class Gibbstack extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [{}],
			albumData: [],
			albumsWithArt: [],
			selectedAlbum: null,
		};

		this.onClickRow = this.onClickRow.bind(this)
		this.onClickAlbum = this.onClickAlbum.bind(this)
		this.getUniqueItems = this.getUniqueItems.bind(this)
		
	}
	// getLegendItems (data) {
	// 		return this.getUniqueItems(data, this.state.legendBy)
	// }

	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))]
	}

	componentDidMount() {
		var dataUrl = "/gibbstack.csv"

		Promise.all([d3.csv(dataUrl), d3.csv("/albums.csv")]).then(data => {//, (err, data) => {
			console.log(data)
			var playedTracks = data[0]
			var albumData = data[1]
			
			var albumsWithArt = d3.nest()
				.key(d => d['album'])
				.rollup(v => v[0].albumart_url)
				.entries(albumData)

			albumData = albumData.map(d => {
				d.selected = playedTracks.some(t => t['track'] == d['track']); 
				return d
			})

			playedTracks = playedTracks.map(d => {
				d.selected = true
				return d
			})

			albumsWithArt = albumsWithArt.map(d => {
				d.selected = true
				return d
			})

			// var allLegendItems = [...new Set(data.map(item => this.state.legendBy(item)))]
			// console.log(allLegendItems)

			// var newColorScale = this.state.colorScale
			// 	.domain(allLegendItems)

			this.setState({ 
				data: playedTracks,
				albumData: albumData,
				albumsWithArt: albumsWithArt
				// filteredJsonData: data,
				// legendItems: allLegendItems,
				// selectedLegendItems: allLegendItems,
				// colorScale: newColorScale
			})
		});
	}

	onClickRow(event) {
			console.log('legend click')
			var id = event.currentTarget.id
			console.log(id)
			var datum = this.state.data.filter(d => d['track'] == id)[0]
			console.log(datum)
			var url = datum.url + '&t=' + datum.timestamp
			console.log(url)
			window.open(url, '_blank')
	}

	onClickAlbum(event) {
		var album = event.currentTarget.getAttribute('album')
		var selectedAlbum
		var albumsWithArt

		if (this.state.selectedAlbum == null) {
			selectedAlbum = album
			albumsWithArt = this.state.albumsWithArt.map(d => {
				// console.log(d)
				if (album == d['key'])
					d.selected = true
				else
					d.selected = false
				return d
			})
		}
		else {
			selectedAlbum = null
			albumsWithArt = this.state.albumsWithArt.map(d => {
				d.selected = true
				return d
			})
		}

		console.log(album)

		this.setState({
			selectedAlbum: selectedAlbum,
			albumsWithArt: albumsWithArt
		})
	}

	

	render() {
		console.log(this.state.albumData)
		return (
			<div id='container'>
				<div id='header'>
					<span className='title'>Ben Gibbard: Live From Home</span>
					<div className='navbar'>
						<Navbar/>
					</div>
				</div>
				<div id='table'>
					<ReactTable 
						data={this.state.selectedAlbum != null ? 
							this.state.albumData.filter(d => d['album'] == this.state.selectedAlbum) : 
							this.state.data }
						headers={this.state.selectedAlbum != null ?
							['trackindex', 'album', 'track'] : 
							['date', 'artist', 'track']}
						showHeaders={true}
						keyBy={'track'}
						onClickRow={this.onClickRow}
						/>
				</div>
				<div id='albumart'>
					
					{this.state.albumsWithArt.filter(d => d.selected).map(d => 
						<AlbumArt 
							key={d['track']} 
							album={d} 
							onClick={this.onClickAlbum} 
							isSelected={this.state.selectedAlbum==d['album']}
							/>
					)}
				</div>
			</div>

		) 
	}
}
function AlbumArt(props) {
	// console.log(props.data)
	var d = props.album
	// return props.data.map(d => {
	return <img key={d.key} src={d.value} album={d.key} onClick={props.onClick} style={{'width': props.isSelected ? '50%' : '100%'}}/>
		
	// })
}

function Navbar(props) {
	return (
			<ul className='navbar-nav'>
				<li>
					<a href='#' className='navbar-link'>
						<span className='link-text'>Days</span>
					</a>
				</li>
				<li>
					<a href='#' className='navbar-link'>
						<span className='link-text'>Songs</span>
					</a>
				</li>
				<li>
					<a href='#' className='navbar-link'>
						<span className='link-text'>Charities</span>
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


