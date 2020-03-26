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

		// this.onClickRow = this.onClickRow.bind(this)
		this.onClickAlbum = this.onClickAlbum.bind(this)
		this.getUniqueItems = this.getUniqueItems.bind(this)
		this.getTrackUrl = this.getTrackUrl.bind(this)
		
	}
	// getLegendItems (data) {
	// 		return this.getUniqueItems(data, this.state.legendBy)
	// }

	getUniqueItems (data, accessor) {
			return [...new Set(data.map(accessor))]
	}

	componentDidMount() {
		var dataUrl = "/songs.csv"

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

			console.log(albumData)

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

	// onClickRow(event) {
	// 		console.log('legend click')
	// 		var id = event.currentTarget.id
	// 		console.log(id)
	// 		var datum = this.state.data.filter(d => d['track'] == id)[0]
	// 		console.log(datum)
	// 		var url = datum.url + '&t=' + datum.timestamp
	// 		console.log(url)
	// 		window.open(url, '_blank')
	// }

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

	getTrackUrl(track) {
		// console.log()
		var song = this.state.data.find(q => q['track'] == track['track'])

		return song ? song.url + '&t=' + song.timestamp : ''
	}

	

	render() {
		console.log(this.state.selectedAlbum != null ? 
							this.state.albumData.filter(d => d['album'] == this.state.selectedAlbum) : 
							this.state.data )
		return (
			<div id='container' className='songs'>
				<div id='header'>
					<span className='title'>Ben Gibbard: Live From Home</span>
					<div className='navbar'>
						<Navbar/>
					</div>
				</div>
				<div id='table' className='songs'>
					{/*<ReactTable 
						data={this.state.selectedAlbum != null ? 
							this.state.albumData.filter(d => d['album'] == this.state.selectedAlbum) : 
							this.state.data }
						headers={this.state.selectedAlbum != null ?
							['trackindex', 'album', 'track'] : 
							['date', 'artist', 'track']}
						showHeaders={true}
						keyBy={d => d.track + d.date}
						onClickRow={this.onClickRow}
						/>*/}
						<Table
							data={this.state.selectedAlbum != null ? 
								this.state.albumData.filter(d => d['album'] == this.state.selectedAlbum) : 
								this.state.data }
							headers={this.state.selectedAlbum != null ?
								['index', 'album', 'track'] : 
								['date', 'artist', 'track']}
							keyBy={d => d.track + d.date}
							urlFunc={this.getTrackUrl}

							/>
				</div>
				<div id='albumart'>
					{
						this.state.albumsWithArt.filter(d => d.selected).map(d => 
						<AlbumArt 
							key={d['url']} 
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
			<li>
				<a href='https://forms.gle/9ASiSGcGLsJxNJ8D6' className='navbar-link'>
					<span className='link-text'>Friday</span>
				</a>
			</li>
		</ul>
	)
}

function AlbumArt(props) {
	// console.log(props.data)
	var d = props.album
	// return props.data.map(d => {
	return <img 
						key={d.datum} 
						src={d.value} 
						album={d.key} 
						onClick={props.onClick} 
						// style={{'width': props.isSelected ? '50%' : '100%'}}
						/>
}

function Table(props) {
	return (
		<table>
			<thead>
				<tr>
					{props.headers.map(d => {
						return <th key={d}>{d}</th>
					})}
				</tr>
			</thead>
			<tbody>
			{
				props.data.map(d => {
					return (
						<tr key={props.keyBy(d)} id={props.keyBy(d)} onClick={props.onClickRow} >
							{ props.headers.map(key => <td key={key} style={{opacity: d.selected ? 1 : 0.1, 'pointer-events': d.selected ? 'auto' : 'none'}}>
								<a href={props.urlFunc(d)} target='_blank' rel='noopener noreferrer'>{ d[key] }</a>
							</td>) }
						</tr>
					)
				})
			}
			</tbody>
		</table>
	)
}

// function Table(props) {
// 	class ReactTable extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}
	
// 	render() {		
// 		return (
// 			<table>
// 				<Headers 
// 					headers={this.props.headers} 
// 					showHeaders={this.props.showHeaders}/>
// 				<Body 
// 					headers={this.props.headers} 
// 					data={this.props.data} 
// 					keyBy={this.props.keyBy} 
// 					onClickRow={this.props.onClickRow}/>
// 			</table>
// 		)
// 	}

// }
// }
// Render application
ReactDOM.render(
	<ErrorBoundary>
		<Gibbstack />
	</ErrorBoundary>,
	document.getElementById('root')
);


