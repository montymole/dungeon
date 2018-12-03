import * as React from "react";

export abstract class ReactThree extends React.Component<any, any> {
  obj3d: any;
  threeClass: any;
  hasElement: boolean = false;
  element: HTMLElement;

  componentDidMount () {
    this.init();
  }
  componentDidUpdate () {
    this.init();
  }
  componentWillUnmount () {
    if (this.obj3d && this.obj3d.destroy) {
      if (this.element) this.element.remove();
      this.obj3d.destroy();
      delete this.obj3d;
      delete this.element;
    }
  }
  init () {
    const { world } = this.props;
    const { element } = this;
    if (!this.obj3d && world) {
      this.obj3d = new this.threeClass({ element, ...this.props });
    } else {
      if (this.obj3d && this.obj3d.update) this.obj3d.update({ ...this.props });
    }
  }
  render () {
    return this.hasElement ? (
      <div ref={element => {
        if (element) {
          if (element.parentElement) {
            // override functions to prevent crash
            element.parentElement.removeChild = function (n: any) { return this }
            element.parentElement.insertBefore = function (n: any) { return this }
          }
          this.element = element;
        }
      }
      }> {this.props.children}</div >
    ) : null;
  }
}
