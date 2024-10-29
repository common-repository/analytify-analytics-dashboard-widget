<?php
/**
 * Generates the view for the notice.
 * 
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="analytify-activation-cards">
	<div class="analytify-activation-card-header">
		<img src="<?php echo ANALYTIFY_WIDGET_PATH . 'assets/images/logo.svg'; ?>" alt="Analytify">
	</div>
	<div class="analytify-activation-card-body">
		<?php echo $message; ?>
	</div>
</div>
