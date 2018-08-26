import { connect } from 'react-redux';
import TreeDiagram from './component/TreeDiagram';
import {
  selectCodeCrumb,
  selectNode,
  setDependenciesEntryPoint,
  toggleFolder
} from 'components/data-bus/store/actions';

const mapStateToProps = state => {
  const { checkedState } = state.viewSwitches;
  const {
    filesTreeLayoutNodes,
    dependenciesList,
    closedFolders,
    dependenciesEntryPoint
  } = state.dataBus;

  return {
    sourceDiagramOn: checkedState.source,
    dependenciesDiagramOn: checkedState.dependencies,
    dependenciesShowOneModule: checkedState.dependenciesShowOneModule,
    codeCrumbsDiagramOn: checkedState.codeCrumbs,
    codeCrumbsMinimize: checkedState.codeCrumbsMinimize,
    codeCrumbsDetails: checkedState.codeCrumbsDetails,
    filesTreeLayoutNodes,
    dependenciesList,
    closedFolders,
    dependenciesEntryPoint
  };
};

const mapDispatchToProps = {
  onCodeCrumbSelect: selectCodeCrumb,
  onNodeTextClick: selectNode,
  onFileIconClick: setDependenciesEntryPoint,
  onFolderIconClick: toggleFolder
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeDiagram);
