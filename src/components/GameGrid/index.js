import React, { Component } from 'react'

class GameGrid extends Component {
    render() {
        return (
            <div className="grid__container">
                <section id="grid">
                    {this.props.gridShuffled}
                </section>
            </div>
        )
    }
}

export default GameGrid