import React, { Component } from 'react';

class GameMenu extends Component {
    getStarStyle = starIcon => {
        return {
            backgroundImage: `url(${starIcon})`,
            backgroundSize: 'contain',
            height: 20,
            width: 20,
            cursor: 'pointer',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }
    }

    render() {
        const { emptyStarIcon, filledStarIcon, refreshIcon } = this.props
        const refreshIconStyle = {
            backgroundImage: `url(${refreshIcon})`,
            backgroundSize: 'contain',
            height: 24,
            width: 24,
            cursor: 'pointer'
        }
        let star1Style
        let star2Style
        let star3Style
        if (this.props.stars === 3) {
            star1Style = this.getStarStyle(filledStarIcon)
            star2Style = this.getStarStyle(filledStarIcon)
            star3Style = this.getStarStyle(filledStarIcon)
        } else if (this.props.stars === 2) {
            star1Style = this.getStarStyle(filledStarIcon)
            star2Style = this.getStarStyle(filledStarIcon)
            star3Style = this.getStarStyle(emptyStarIcon)
        } else {
            star1Style = this.getStarStyle(filledStarIcon)
            star2Style = this.getStarStyle(emptyStarIcon)
            star3Style = this.getStarStyle(emptyStarIcon)
        }
        return (
            <div className="game__menu">
                <span 
                    style={refreshIconStyle} 
                    className="reset-icon" 
                    id="reset-btn"
                    onClick={this.props.handleReset}
                >
                </span>
                <span id="timer">{this.props.timerText}</span>
                <div className="game__stats">
                    <span id="stats__moves">{this.props.moveCounterText}</span>
                    <span className="stats__stars">
                        <span style={star1Style} className="star filled-star" id="star1"></span>
                        <span style={star2Style} className="star" id="star2"></span>
                        <span style={star3Style} className="star" id="star3"></span>
                    </span>
                </div>
            </div>
        );
    }
}

export default GameMenu;