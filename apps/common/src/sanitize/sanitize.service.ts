import { Inject,Injectable,OnModuleInit } from '@nestjs/common';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { ATTR_WHILE_LIST,PURIFY_OPTIONS,SANITIZE_OPTIONS } from './constants';
import { ISanitizeOptions } from './sanitize.interface';

@Injectable()
export class SanitizeService implements OnModuleInit {
  private DOMPurify: ReturnType<typeof createDOMPurify>;

  constructor(
    @Inject(SANITIZE_OPTIONS) private readonly options: ISanitizeOptions
  ) { }

  onModuleInit() {
    const window=new JSDOM('').window as any;
    this.DOMPurify=createDOMPurify(window);

    // хук для проверки атрибутов
    this.DOMPurify.addHook('uponSanitizeAttribute',(node: any,data: any) => {
      if (!data||!data.attrName) {
        return
      };

      const tagName=(node?.nodeName||'').toLowerCase();
      const attrName=data.attrName.toLowerCase();
      const attrValue=data.attrValue;

      // Удаляем эвенты
      if (/^on/i.test(attrName)) {
        node.removeAttribute(attrName);
        return;
      }

      if (attrName==='style') {
        node.removeAttribute('style');
        return;
      }

      if (attrName==='href'&&!this.isSafeUrl(attrValue)) {
        node.removeAttribute('href');
        return;
      }

      if (attrName==='src') {
        if (tagName!=='img'||!this.isAllowedImageSrc(attrValue)) {
          console.log(attrName,attrValue,tagName,data)
          node.removeAttribute('src');
        }
        return;
      }

      if (attrName==='srcset') {
        node.removeAttribute('srcset');
        return;
      }

      const allowedForTag=ATTR_WHILE_LIST[tagName]||ATTR_WHILE_LIST['*'];
      if (allowedForTag.indexOf(attrName)===-1) {
        node.removeAttribute(attrName);
      }
    });
  }

  sanitize(dirtyHtml: string): string {
    if (!dirtyHtml) {
      return '';
    }
    const cleaned=this.DOMPurify.sanitize(dirtyHtml,PURIFY_OPTIONS);

    const doc=new JSDOM(cleaned).window.document;
    doc.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
      const href=a.getAttribute('href')||'';

      try {
        const u=new URL(href,`https://${this.options.hostName}`);
        if (u.hostname&&u.hostname===this.options.hostName) {
          a.setAttribute('rel','noopener noreferrer');

          if (!a.getAttribute('target')) {
            a.setAttribute('target','_blank');
          }
        } else {
          a.removeAttribute('href');
        }
      } catch (e) {
        a.removeAttribute('href');
      }
    });

    const final=doc.body.innerHTML;
    return final;
  }

  private isSafeUrl(raw: string): boolean {
    try {
      if (raw.startsWith('mailto:')) {
        return true;
      }

      const u=new URL(raw,`https://${this.options.hostName}`);
      return u.protocol.search(/^http(s|)\:$/)!==-1;
    } catch (e) {
      return false;
    }
  }

  private isAllowedImageSrc(src: string): boolean {
    try {
      const u=new URL(src,`https://${this.options.hostName}`);
      if (!u.hostname||u.hostname===this.options.hostName) {
        return true;
      }

      return this.options.imgHostAllowList.indexOf(u.hostname)!==-1;
    } catch (e) {
      return false;
    }
  }
}