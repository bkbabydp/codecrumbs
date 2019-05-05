import React from 'react';

import {
  CodeCrumbedFlowEdge,
  ExternalEdge
} from 'components/treeDiagram/component/Edge/CodeCrumbEdge';
import { isCodeCrumbsEqual, getCcPosition } from './helpers';

export default props => {
  const {
    namespace,
    areaHeight,
    namespacesList,
    shiftToCenterPoint,
    ccAlightPoint,
    ccShiftIndexMap,
    sortedFlowSteps,
    ccFilesLayoutMapNs,
    codeCrumbsMinimize,
    onFlowEdgeClick,
    selectedCcFlowEdgeNodes
  } = props;

  const codecrumbsLayoutMap = ccFilesLayoutMapNs[namespace];
  const ccNamespacesKeys = Object.keys(ccFilesLayoutMapNs || {});

  return (
    <React.Fragment>
      {!codeCrumbsMinimize &&
        sortedFlowSteps.map((toItem, i, list) => {
          if (!i) return null;

          const fromItem = list[i - 1];
          if (fromItem.namespace !== namespace && toItem.namespace !== namespace) {
            return null;
          }

          const edgePoints = [fromItem, toItem].map(crumb => {
            const [_, cY] = [crumb.y, crumb.x];
            return shiftToCenterPoint(getCcPosition(ccAlightPoint, ccShiftIndexMap[crumb.id]), cY);
          });

          const edgeBaseProps = {
            key: `cc-external-edge-${fromItem.name}-${toItem.name}`,
            sourcePosition: edgePoints[0],
            targetPosition: edgePoints[1],
            onClick: () => onFlowEdgeClick(fromItem, toItem, ccNamespacesKeys),
            selected: isFlowEdgeSelected(selectedCcFlowEdgeNodes, fromItem, toItem)
          };

          const namespaceIndex = namespacesList.indexOf(namespace);

          if (fromItem.namespace === namespace && toItem.namespace !== namespace) {
            const fromFile = codecrumbsLayoutMap[fromItem.filePath];
            const toFile = ccFilesLayoutMapNs[toItem.namespace][toItem.filePath];

            return (
              <ExternalEdge
                {...edgeBaseProps}
                singleCrumbSource={fromFile.children.length === 1}
                singleCrumbTarget={toFile.children.length === 1}
                areaHeight={areaHeight}
                topBottom={namespaceIndex < namespacesList.indexOf(toItem.namespace)}
                firstPart={true}
              />
            );
          }

          if (fromItem.namespace !== namespace && toItem.namespace === namespace) {
            const fromFile = ccFilesLayoutMapNs[fromItem.namespace][fromItem.filePath];
            const toFile = codecrumbsLayoutMap[toItem.filePath];

            return (
              <ExternalEdge
                {...edgeBaseProps}
                singleCrumbSource={fromFile.children.length === 1}
                singleCrumbTarget={toFile.children.length === 1}
                areaHeight={areaHeight}
                topBottom={namespaceIndex < namespacesList.indexOf(fromItem.namespace)}
              />
            );
          }

          const fromFile = codecrumbsLayoutMap[fromItem.filePath];
          const toFile = codecrumbsLayoutMap[toItem.filePath];

          return (
            <CodeCrumbedFlowEdge
              {...edgeBaseProps}
              singleCrumbSource={fromFile.children.length === 1}
              singleCrumbTarget={toFile.children.length === 1}
              sourceName={fromItem.name}
              targetName={toItem.name}
            />
          );
        })}
    </React.Fragment>
  );
};

const isFlowEdgeSelected = (selectedCcFlowEdgeNodes, currentSource, currentTarget) => {
  if (!selectedCcFlowEdgeNodes) return false;

  const { source, target } = selectedCcFlowEdgeNodes;
  return isCodeCrumbsEqual(source, currentSource) && isCodeCrumbsEqual(target, currentTarget);
};
