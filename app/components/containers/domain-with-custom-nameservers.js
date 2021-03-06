// External dependencies
import { connect } from 'react-redux';

// Internal dependencies
import { recordTracksEvent } from 'actions/analytics';
import { resetDomain } from 'actions/my-domains';
import DomainWithCustomNameservers from 'components/ui/my-domains/domain-card/domain-with-custom-nameservers';

export default connect(
	undefined,
	{
		recordTracksEvent,
		resetDomain,
	}
)( DomainWithCustomNameservers );

