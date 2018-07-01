import React, { Component } from 'react'

import GameMenu from './components/GameMenu'
import GameGrid from './components/GameGrid'
import WinModal from './components/WinModal'

import arrowIcon from './icons/arrow.svg'
import emptyStarIcon from './icons/empty-star.svg'
import filledStarIcon from './icons/filled-star.svg'
import refreshIcon from './icons/refresh.svg'

import './rpg.css'
import './responsive.css'

class MemoryGame extends Component {
	constructor(props) {
		super(props)
		this.state = {
			gridShuffled: [],
			firstCard: null,
			secondCard: null,
			isChecking: false,
			setsMatched: 0,
			win: false,
			moves: 0,
			timer: new Date(0),
			stars: 3,
			interval: null,
			timerText: '',
			moveCounterText: '',
			winModalData: {
				timeResultText: null,
				starResultText: null,
				isModalOn: false
			}
		}
		this.initialState = null
	}

	win = () => {
		clearInterval(this.state.interval)
		const time = this.state.timer
		const defaultText = (
			<React.Fragment>
				<span>{time.getUTCSeconds()}</span>
				<span className="time-unit">s</span>
			</React.Fragment>
		)
		const timeResultText = (
			<React.Fragment>
				{
					time.getUTCMinutes() ?
						<React.Fragment>
							<span>{time.getUTCMinutes()}</span>
							<span className="time-unit">m</span>
							<span>{defaultText}</span>
						</React.Fragment> :
						<span>{defaultText}</span>
				}
			</React.Fragment>
		)
		const starResultText = <span>{this.state.stars} out of {this.initialState.stars}</span>
		this.setState({
			winModalData: {
				timeResultText,
				starResultText,
				isModalOn: true
			}
		})
	}

	componentDidMount() {
		this.beginGame()
	}

	generateCards = () => {
		const icons = [
			'ra-pills',
			'ra-fox',
			'ra-toast',
			'ra-gamepad-cross',
			'ra-pisces',
			'ra-perspective-dice-one',
			'ra-skull',
			'ra-acid'
		]
		let html = []
		let iconsArr = [...icons]

		for (let i = 0; i < 16; i++) {
			const randIndex = Math.floor(Math.random() * iconsArr.length)
			const selection = iconsArr.splice(randIndex, 1)
			iconsArr = i === 7 ? [...icons] : iconsArr
			html.push(
				<div
					key={selection + i}
					className="card"
					data-name={selection}
					onClick={this.handleFlip}
				>
					<div className="card__side card__back"></div>
					<div className={`ra ${selection} card__side card__front`}></div>
				</div>
			)
		}

		this.setState(
			{ gridShuffled: html },
			() => this.initialState = this.state
		)
	}

	handleFlip = e => {
		const condition = e.target.classList.length === 1
		const card = condition ? e.target : e.target.parentElement

		if (this.state.moves === 0) {
			this.startTimer()
		}

		if (!card.dataset.matched && !this.state.isChecking) {
			if (!this.state.firstCard) {
				this.setState(
					prevState => ({ moves: prevState.moves + 1 }),
					() => this.updateMovesAndStars(this.state.moves)
				)
				// this.updateMovesAndStars(this.state.moves)
				card.classList.toggle('flipped')
				this.setState({ firstCard: card })
			} else if (card !== this.state.firstCard) {
				card.classList.toggle('flipped')
				this.setState({ secondCard: card, isChecking: true })
				setTimeout(this.checkMatch, 550)
			}
		}
	}

	checkMatch = () => {
		let { firstCard, secondCard } = this.state
		if (firstCard.dataset.name === secondCard.dataset.name) {
			firstCard.classList.add('bounce')
			secondCard.classList.add('bounce')
			firstCard.dataset.matched = true
			secondCard.dataset.matched = true
			this.setState(prevState => ({ setsMatched: prevState.setsMatched + 1 }))
			if (this.state.setsMatched === 8) {
				this.setState({ win: true })
				this.win()
			}
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					firstCard.classList.remove('bounce')
					secondCard.classList.remove('bounce')
				}, 500)
			})
		} else {
			firstCard.classList.add('wiggle')
			secondCard.classList.add('wiggle')
			// requestAnimationFrame makes the css transition more consistent
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					firstCard.classList.remove('wiggle')
					secondCard.classList.remove('wiggle')
					firstCard.classList.toggle('flipped')
					secondCard.classList.toggle('flipped')
				}, 500)
			})
		}
		this.setState({
			firstCard: null,
			secondCard: null,
			isChecking: false
		})
	}

	updateMovesAndStars = (moves) => {
		const moveCounterText = moves === 1 ? `${moves} Move` : `${moves} Moves`
		this.setState({ moveCounterText })
		if (moves < 14) {
			this.setState({ stars: 3 })
		} else {
			if (moves < 18) {
				this.setState({ stars: 2 })
			} else {
				this.setState({ stars: 1 })
			}
		}
	}

	startTimer = () => {
		this.setState({
			interval: setInterval(() => {
				this.state.timer.setUTCSeconds(this.state.timer.getUTCSeconds() + 1)
				this.updateTimer(this.state.timer)
			}, 1000)
		})
	}

	updateTimer = time => {
		const defaultText = (
			<React.Fragment>
				<span>{time.getUTCSeconds()}</span>
				<span className="time-unit">s</span>
			</React.Fragment>
		)
		this.setState({
			timerText: (
				<React.Fragment>
					{
						time.getUTCMinutes() ?
							<React.Fragment>
								<span>{time.getUTCMinutes()}</span>
								<span className="time-unit">m</span>
								<span>{defaultText}</span>
							</React.Fragment> :
							<span>{defaultText}</span>
					}
				</React.Fragment>
			)
		})
	}

	beginGame = () => {
		// Create cards
		this.generateCards()

		// Set initial values
		this.updateMovesAndStars(this.state.moves)
		this.updateTimer(this.state.timer)
	}

	flipBackCards = () => {
		for (let card of document.getElementsByClassName('card')) {
			if (card.dataset.matched) {
				delete card.dataset.matched
				card.classList.remove('flipped')
			}
		}
		if (this.state.firstCard) {
			this.state.firstCard.classList.remove('flipped')
		}
	}

	handleReset = () => {
		this.flipBackCards()

		this.setState(prevState => ({
			winModalData: {
				...prevState.winModalData,
				isModalOn: false
			}
		}))

		if (!this.state.win) {
			clearInterval(this.state.interval)
		}

		const initialState = this.initialState
		setTimeout(() => {
			this.setState(
				{ ...initialState },
				() => {
					this.setState(
						{ timer: new Date(0) },
						() => this.updateTimer(this.state.timer)
					)
					this.updateMovesAndStars(this.state.moves)
					setTimeout(this.generateCards, 500)
				}
			)
		}, 500)
	}

	hanldleHideModal = e => {
		if (e.target.id === 'modal') {
			this.setState(prevState => ({
				winModalData: {
					...prevState.winModalData,
					isModalOn: false
				}
			}))
		}
	}

	render() {
		const icons = { arrowIcon, emptyStarIcon, filledStarIcon, refreshIcon }
		return (
			<div className="memory-game__wrapper">
				<div className="game__wrapper">
					<GameMenu
						{...icons}
						timerText={this.state.timerText}
						moveCounterText={this.state.moveCounterText}
						handleReset={this.handleReset}
						stars={this.state.stars}
					/>
					<GameGrid gridShuffled={this.state.gridShuffled} />
				</div>
				<WinModal
					handleHideModal={this.hanldleHideModal}
					reset={this.handleReset}
					{...this.state.winModalData}
					arrowIcon={arrowIcon}
					stars={this.state.stars}
				/>
			</div>
		)
	}
}

export default MemoryGame
