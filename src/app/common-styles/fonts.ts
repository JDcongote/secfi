import {createGlobalStyle} from 'styled-components';

// currently  there's a bug loading fonts in styled-components, this is a workaround. see: https://github.com/styled-components/styled-components/issues/2227
import '@styles/_typography.scss';

const FontStyle = createGlobalStyle`
`;

export default FontStyle;
