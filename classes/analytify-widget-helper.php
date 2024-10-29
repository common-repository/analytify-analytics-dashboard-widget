<?php
// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * A class that contains helper methods for the widget add-on.
 */
class AnalytifyWidgetHelper {

	/**
	 * Shows the $message in a markup wrapper.
	 *
	 * @param string $message
	 * @return void
	 */
	public static function notice( $message ) {
		require_once ANALYTIFY_DASHBOARD_ROOT_PATH . '/views/admin/notice.php';
	}

	/**
	 * Returns start and end date.
	 *
	 * @return array
	 */
	public static function get_dates() {

		$dates = array(
			'start' => '',
			'end'   => '',
		);

		if ( isset( $_POST['startDate'] ) && ! empty( $_POST['startDate'] ) && isset( $_POST['endDate'] ) && ! empty( $_POST['endDate'] ) ) {
			$dates['start'] = sanitize_text_field( wp_unslash( $_POST['startDate'] ) );
			$dates['end']   = sanitize_text_field( wp_unslash( $_POST['endDate'] ) );
			return $dates;
		}

		$dates['start'] = wp_date( 'Y-m-d', strtotime( '- 7 days' ) );
		$dates['end']   = wp_date( 'Y-m-d', strtotime( 'now' ) );

		$differ = get_option( 'analytify_widget_date_differ' );

		if ( $differ ) {
			switch ( $differ ) {

				case 'current_day':
					$dates['start'] = wp_date( 'Y-m-d' );
					break;
				
				case 'yesterday':
					$dates['start'] = wp_date( 'Y-m-d', strtotime( '-1 days' ) );
					$dates['end']   = wp_date( 'Y-m-d', strtotime( '-1 days' ) );
					break;

				case 'last_7_days':
					$dates['start'] = wp_date( 'Y-m-d', strtotime( '-7 days' ) );
					break;

				case 'last_14_days':
					$dates['start'] = wp_date( 'Y-m-d', strtotime( '-14 days' ) );
					break;

				case 'last_30_days':
					$dates['start'] = wp_date( 'Y-m-d', strtotime( '-1 month' ) );
					break;

				case 'this_month':
					$dates['start'] = wp_date( 'Y-m-01' );
					break;

				case 'last_month':
					$dates['start'] = wp_date( 'Y-m-01', strtotime( '-1 month' ) );
					$dates['end']   = wp_date( 'Y-m-t', strtotime( '-1 month' ) );
					break;

				case 'last_3_months':
					$dates['start'] = wp_date( 'Y-m-01', strtotime( '-3 month' ) );
					$dates['end']   = wp_date( 'Y-m-t', strtotime( '-1 month' ) );
					break;

				case 'last_6_months':
					$dates['start'] = wp_date( 'Y-m-01', strtotime( '-6 month' ) );
					$dates['end']   = wp_date( 'Y-m-t', strtotime( '-1 month' ) );
					break;

				case 'last_year':
					$dates['start'] = wp_date( 'Y-m-01', strtotime( '-1 year' ) );
					$dates['end']   = wp_date( 'Y-m-t', strtotime( '-1 month' ) );
					break;

				default:
					break;
			}
		}

		return $dates;
	}
}

/**
* Helper function for translation.
*/
if ( ! function_exists( 'analytify__' ) ) {
	/**
	 * Wrapper for __() gettext function.
	 *
	 * @param string $string     Translatable text string.
	 * @param string $textdomain Text domain, default: wp-analytify.
	 *
	 * @return string
	 */
	function analytify__( $string, $textdomain = 'wp-analytify' ) {
		return __( $string, $textdomain );
	}
}

if ( ! function_exists( 'analytify_e' ) ) {
	/**
	 * Wrapper for _e() gettext function.
	 *
	 * @param string $string     Translatable text string.
	 * @param string $textdomain Text domain, default: wp-analytify.
	 *
	 * @return void
	 */
	function analytify_e( $string, $textdomain = 'wp-analytify' ) {
		echo __( $string, $textdomain );
	}
}
