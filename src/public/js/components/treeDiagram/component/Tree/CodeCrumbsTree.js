import React from 'react';

import { CodeCrumbName } from 'components/treeDiagram/component/Node/CodeCrumb';
import { FileName } from 'components/treeDiagram/component/Node/File';
import {
  PartEdge,
  CodeCrumbEdge,
  CodeCrumbedFlowEdge
} from 'components/treeDiagram/component/Edge/CodeCrumbEdge';

export const CodeCrumbedFlowEdges = props => {
  const {
    fileNodesMap, // TODO: should come from BE
    shiftToCenterPoint,
    codeCrumbsMinimize,
    codeCrumbedFlowsMap,
    selectedCrumbedFlowKey
  } = props;

  const currentFlow = codeCrumbedFlowsMap[selectedCrumbedFlowKey] || {};

  let sortedFlowSteps = [];
  Object.keys(currentFlow).forEach(filePath => {
    const steps = fileNodesMap[filePath].children
      .filter(({ data }) => data.params.flow === selectedCrumbedFlowKey)
      .map(({ data, x, y }) => ({
        filePath,
        step: data.params.flowStep,
        flow: selectedCrumbedFlowKey,
        x,
        y
      }));

    sortedFlowSteps = sortedFlowSteps.concat(steps);
  });

  sortedFlowSteps.sort((a, b) => a.step - b.step);

  return (
    <React.Fragment>
      {!codeCrumbsMinimize &&
        sortedFlowSteps.map((toItem, i, list) => {
          if (!i) return null;

          const fromItem = list[i - 1];
          const fromFile = fileNodesMap[fromItem.filePath];
          const toFile = fileNodesMap[toItem.filePath];

          const edgePoints = [fromItem, toItem].map(crumb => {
            const [cX, cY] = [crumb.y, crumb.x];
            return shiftToCenterPoint(cX, cY);
          });

          return (
            <CodeCrumbedFlowEdge
              key={`cc-flow-edge-${i}`}
              singleCrumbSource={fromFile.children.length === 1}
              singleCrumbTarget={toFile.children.length === 1}
              sourcePosition={edgePoints[0]}
              targetPosition={edgePoints[1]}
            />
          );
        })}
    </React.Fragment>
  );
};

class CodeCrumbsTree extends React.Component {
  render() {
    const {
      fileNodesMap, // TODO: should come from BE
      selectedCrumbedFlowKey,
      shiftToCenterPoint,
      sourceDiagramOn,
      dependenciesDiagramOn,
      codeCrumbsMinimize,
      codeCrumbsLineNumbers,
      onCodeCrumbSelect
    } = this.props;

    return (
      <React.Fragment>
        {Object.keys(fileNodesMap).map(key => {
          const node = fileNodesMap[key];

          const [nX, nY] = [node.y, node.x];
          const position = shiftToCenterPoint(nX, nY);

          if (!node.children) {
            return null;
          }

          return (
            <React.Fragment key={`code-crumb-${node.data.name}`}>
              {!sourceDiagramOn && !dependenciesDiagramOn ? (
                <FileName position={position} name={node.data.name} purple={codeCrumbsMinimize} />
              ) : null}
              {(!codeCrumbsMinimize && (
                <PartEdge sourcePosition={position} parentName={node.data.name} />
              )) ||
                null}

              {!codeCrumbsMinimize &&
                node.children.map((crumb, i, list) => {
                  const [cX, cY] = [crumb.y, crumb.x];
                  const crumbPosition = shiftToCenterPoint(cX, cY);
                  const singleCrumb = list.length === 1;
                  const crumbData = crumb.data;
                  const ccParams = crumbData.params;

                  return (
                    <React.Fragment key={`code-crumb-edge-${i}`}>
                      {(!singleCrumb && (
                        <CodeCrumbEdge
                          sourcePosition={position}
                          targetPosition={crumbPosition}
                          parentName={node.data.name}
                        />
                      )) ||
                        null}
                      <CodeCrumbName
                        position={crumbPosition}
                        loc={codeCrumbsLineNumbers ? crumbData.displayLoc : ''}
                        name={crumbData.name}
                        singleCrumb={singleCrumb}
                        cover={dependenciesDiagramOn}
                        flow={ccParams.flow && ccParams.flow === selectedCrumbedFlowKey}
                        flowStep={ccParams.flowStep}
                        onClick={() => onCodeCrumbSelect(node.data, crumbData)}
                      />
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
}

export default CodeCrumbsTree;
