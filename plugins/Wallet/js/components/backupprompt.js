import PropTypes from 'prop-types'
import React from 'react'

const BackupPrompt = ({primarySeed, auxSeeds, actions}) => {
	const handleOkClick = () => actions.hideBackupPrompt()
	return (
		<div className="modal">
			<div className="backupprompt">
				{ auxSeeds.length === 0 ? (
					<h3> Write down your seed to back up your wallet. You can restore your wallet using only this seed. </h3>
				) : (
					<h3> Write down your seeds to back up your wallet. You can restore your wallet using only these seeds. </h3>
				)}

				<h4> Primary Seed: </h4>
				<p className="primary-seed">{primarySeed}</p>
				{auxSeeds.length > 0 ? ( <h4> Auxiliary Seeds: </h4> ) : null}
				{auxSeeds.length > 0 ? (
					<div className="aux-seeds">
						{auxSeeds.map((seed, key) => (
							<div className="aux-seed" key={key}>{seed}</div>
						))}
					</div>
				) : null}
				<button className="button" onClick={handleOkClick}>OK</button>
			</div>
		</div>
	)
}
BackupPrompt.propTypes = {
	primarySeed: PropTypes.string.isRequired,
	auxSeeds: PropTypes.array.isRequired,
}

export default BackupPrompt
