// External dependencies
import i18n from 'i18n-calypso';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal dependencies
import CheckoutProgressbar from 'components/ui/checkout-progressbar';
import creditCardDetails from 'lib/credit-card-details';
import styles from './styles.scss';
import capitalize from 'lodash/capitalize';
import FormToggle from 'components/ui/form/form-toggle';
import ValidationError from 'components/ui/form/validation-error';
import Input from 'components/ui/form/input';

const Checkout = React.createClass( {
	propTypes: {
		checkout: PropTypes.object.isRequired,
		createSite: PropTypes.func.isRequired,
		createTransaction: PropTypes.func.isRequired,
		isLoggedIn: PropTypes.bool.isRequired,
		redirectToSearch: PropTypes.func.isRequired,
		redirectToSignup: PropTypes.func.isRequired,
		redirectToSuccess: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	},

	componentDidMount() {
		if ( ! this.props.checkout.domain ) {
			this.props.redirectToSearch();
		}

		if ( ! this.props.isLoggedIn ) {
			this.props.redirectToSignup();
		}

		this.props.initializeForm( {
			privacyProtection: true
		} );
	},

	componentWillReceiveProps( nextProps ) {
		const { checkout } = nextProps,
			{ values } = this.props;

		if ( ! checkout ) {
			return;
		}

		if ( checkout.site && ! checkout.transaction ) {
			return this.props.createTransaction( this.props.user, Object.assign( {}, values, { blogId: checkout.site.blogId, domain: checkout.domain } ) );
		}

		if ( checkout.transaction ) {
			this.props.redirectToSuccess();
		}
	},

	checkout( event ) {
		event.preventDefault();

		this.props.createSite();
	},

	validateSubmit( values ) {
		const errors = creditCardDetails.validateCardDetails( values ).errors;

		if ( errors ) {
			return Promise.reject( errors );
		}

		return Promise.resolve();
	},

	renderForm() {
		const months = i18n.moment.months(),
			{ fields, handleSubmit } = this.props;

		return (
			<div>
				<CheckoutProgressbar currentStep={ 3 } />

				<form className={ styles.form } onSubmit={ handleSubmit( this.validateSubmit ) }>
					<div className={ styles.fieldArea }>
						<fieldset>
							<label>{ i18n.translate( 'Name on Card' ) }</label>
							<Input
								type="text"
								field={ fields.name }
								autoFocus
							/>
							<ValidationError field={ fields.name } />
						</fieldset>

						<fieldset>
							<label>{ i18n.translate( 'Card Number' ) }</label>
							<Input
								type="text"
								field={ fields.number }
							/>
							<ValidationError field={ fields.number } />
						</fieldset>

						<fieldset>
							<label>{ i18n.translate( 'Expiration' ) }</label>
							<div className={ styles.expiration }>
								<select
									{ ...fields.expirationMonth }
									className={ styles.expirationMonth }>
									<option>{ i18n.translate( 'Month' ) }</option>
									{ months.map( ( monthName, monthIndex ) => {
										const monthNumber = monthIndex + 1;
										return (
											<option value={ String( monthNumber < 10 ? '0' + monthNumber : monthNumber ) } key={ monthNumber }>
												{ capitalize( monthName ) }
											</option>
										);
									} ) }
								</select>

								<select
									{ ...fields.expirationYear }
									className={ styles.expirationYear }>
									<option>{ i18n.translate( 'Year' ) }</option>
									<option value="19">2019</option>
									<option value="18">2018</option>
									<option value="17">2017</option>
									<option value="16">2016</option>
								</select>
							</div>
							<ValidationError fields={ [
								fields.expirationMonth,
								fields.expirationYear
							] } />
						</fieldset>

						<fieldset className={ styles.securityCode }>
							<label>{ i18n.translate( 'Security Code' ) }</label>
							<Input
								type="text"
								field={ fields.cvv }
							/>
							<ValidationError field={ fields.cvv } />
						</fieldset>
					</div>

					<div className={ styles.orderSummary }>
						<h2>{ i18n.translate( 'Order Summary' ) }</h2>
						<div className={ styles.orderItem }>
							<span>{ this.props.checkout.domain }</span>
							<span>{ this.props.checkout.cost }</span>
						</div>
						<div className={ styles.orderItem }>
							<label>{ i18n.translate( 'Privacy Protection' ) }</label>
							<span>
								<FormToggle
									name="privacy-protection"
									{ ...fields.privacyProtection }
								/>
								<span className={ styles.privacyProtectionPrice }>FREE</span>
							</span>
						</div>
					</div>

					<div className={ styles.submitArea }>
						<button>{ i18n.translate( 'Checkout' ) }</button>
					</div>
				</form>
			</div>
		);
	},

	render() {
		return (
			<div>
				{ this.renderForm() }
			</div>
		);
	}
} );

export default withStyles( styles )( Checkout );
