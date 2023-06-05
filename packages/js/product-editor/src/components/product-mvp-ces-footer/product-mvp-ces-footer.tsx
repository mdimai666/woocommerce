/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	createElement,
	createInterpolateElement,
	Fragment,
} from '@wordpress/element';
import { closeSmall } from '@wordpress/icons';
import { WooFooterItem } from '@woocommerce/admin-layout';
import { Pill } from '@woocommerce/components';
import {
	ALLOW_TRACKING_OPTION_NAME,
	SHOWN_FOR_ACTIONS_OPTION_NAME,
	STORE_KEY,
} from '@woocommerce/customer-effort-score';
import { OPTIONS_STORE_NAME, Product } from '@woocommerce/data';
import { recordEvent } from '@woocommerce/tracks';

/**
 * Internal dependencies
 */
import {
	PRODUCT_MVP_CES_ACTION_OPTION_NAME,
	NEW_PRODUCT_MANAGEMENT_ENABLED_OPTION_NAME,
} from '../../constants';

export type ProductMVPCESFooterProps = {
	product: Partial< Product >;
};

export function ProductMVPCESFooter( { product }: ProductMVPCESFooterProps ) {
	const { showCesModal, showProductMVPFeedbackModal } =
		useDispatch( STORE_KEY );
	const { updateOptions } = useDispatch( OPTIONS_STORE_NAME );
	const {
		cesAction,
		allowTracking,
		cesShownForActions,
		resolving: isLoading,
	} = useSelect( ( select ) => {
		const { getOption, hasFinishedResolution } =
			select( OPTIONS_STORE_NAME );

		const action = getOption(
			PRODUCT_MVP_CES_ACTION_OPTION_NAME
		) as string;

		const shownForActions =
			( getOption( SHOWN_FOR_ACTIONS_OPTION_NAME ) as string[] ) || [];

		const allowTrackingOption =
			getOption( ALLOW_TRACKING_OPTION_NAME ) || 'no';

		const resolving =
			! hasFinishedResolution( 'getOption', [
				SHOWN_FOR_ACTIONS_OPTION_NAME,
			] ) ||
			! hasFinishedResolution( 'getOption', [
				PRODUCT_MVP_CES_ACTION_OPTION_NAME,
			] ) ||
			! hasFinishedResolution( 'getOption', [
				ALLOW_TRACKING_OPTION_NAME,
			] );

		return {
			cesShownForActions: shownForActions,
			allowTracking: allowTrackingOption === 'yes',
			cesAction: action,
			resolving,
		};
	} );

	const shareFeedback = () => {
		showCesModal(
			{
				action: cesAction,
				title: __(
					"How's your experience with the product editor?",
					'woocommerce'
				),
				firstQuestion: __(
					'The product editing screen is easy to use',
					'woocommerce'
				),
				secondQuestion: __(
					"The product editing screen's functionality meets my needs",
					'woocommerce'
				),
				onsubmitLabel: __(
					"Thanks for the feedback. We'll put it to good use!",
					'woocommerce'
				),
				shouldShowComments: () => true,
			},
			{},
			{
				type: 'snackbar',
				icon: <span>🌟</span>,
			}
		);
		updateOptions( {
			[ SHOWN_FOR_ACTIONS_OPTION_NAME ]: [
				cesAction,
				...cesShownForActions,
			],
		} );
	};

	const onDisablingNewProductExperience = () => {
		updateOptions( {
			[ PRODUCT_MVP_CES_ACTION_OPTION_NAME ]: 'hide',
		} );
		updateOptions( {
			[ NEW_PRODUCT_MANAGEMENT_ENABLED_OPTION_NAME ]: 'no',
		} );
		showProductMVPFeedbackModal();
	};

	const onDisablingCES = () => {
		updateOptions( {
			[ PRODUCT_MVP_CES_ACTION_OPTION_NAME ]: 'hide',
		} );
	};

	const showCESFooter =
		! isLoading && allowTracking && cesAction && cesAction !== 'hide';

	return (
		<>
			{ showCESFooter && (
				<WooFooterItem>
					<div className="woocommerce-product-mvp-ces-footer">
						<Pill>Beta</Pill>
						<div className="woocommerce-product-mvp-ces-footer__message">
							{ createInterpolateElement(
								__(
									'How is your experience with the new product form? <span><shareButton>Share feedback</shareButton> or <turnOffButton>turn it off</turnOffButton></span>',
									'woocommerce'
								),
								{
									span: (
										<span className="woocommerce-product-mvp-ces-footer__message-buttons" />
									),
									shareButton: (
										<Button
											variant="link"
											onClick={ shareFeedback }
										/>
									),
									turnOffButton: (
										<Button
											onClick={
												onDisablingNewProductExperience
											}
											variant="link"
										/>
									),
								}
							) }
						</div>
						<Button
							className="woocommerce-product-mvp-ces-footer__close-button"
							icon={ closeSmall }
							label={ __( 'Hide this message', 'woocommerce' ) }
							onClick={ onDisablingCES }
						></Button>
					</div>
				</WooFooterItem>
			) }
		</>
	);
}
