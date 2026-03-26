declare module "gsap-trial/SplitText" {
  export class SplitText {
    chars: HTMLElement[];
    lines: HTMLElement[];
    words: HTMLElement[];
    revert(): void;
    constructor(
      target: string | Element | Array<string | Element>,
      vars?: Record<string, unknown>
    );
  }
}
