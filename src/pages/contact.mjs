import { esc, each, pageHeader } from '../layout/helpers.mjs';
import { icon } from '../layout/icons.mjs';

export default {
  id: 'contact',
  path: 'contact/',
  title: 'Contact Us',
  description:
    'Contact Mazzy Law PLLC: 535 Fifth Avenue, 4th Flr #1035, New York, NY 10017. Telephone (917) 671-9019. Monday to Friday, 9:00 a.m. to 5:00 p.m.',
  // The address and telephone appear once on this page, in the body.
  hideFooterContact: true,
  render(ctx) {
    const { site, practiceAreas, root } = ctx;
    const { formId } = site.contactForm;
    const active = Boolean(formId);
    const mapQuery = encodeURIComponent(
      `${site.address.line1.split(',')[0]}, ${site.address.city}, ${site.address.state} ${site.address.zip}`
    );
    const callText = site.phone.display ? ' Please call us at the telephone number on this page.' : '';

    return `
${pageHeader({ title: 'Contact Us' })}

<section class="section section--tight">
  <div class="container contact-layout">
    <div class="contact-details">
      <h2 class="contact-details__title">Office</h2>
      <dl class="contact-list">
        <div>
          <dt>${icon('pin', { size: 20 })}<span>Address</span></dt>
          <dd>
            <address>
              ${esc(site.firmName)}<br>
              ${esc(site.address.line1)}<br>
              ${esc(site.address.city)}, ${esc(site.address.state)} ${esc(site.address.zip)}
            </address>
            <a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${mapQuery}" target="_blank" rel="noopener">Get directions<span class="visually-hidden"> (opens Google Maps in a new tab)</span></a>
          </dd>
        </div>
        ${
          site.phone.display
            ? `<div>
          <dt>${icon('phone', { size: 20 })}<span>Telephone</span></dt>
          <dd><a href="tel:${esc(site.phone.href)}">${esc(site.phone.display)}</a></dd>
        </div>`
            : ''
        }
        ${
          site.email
            ? `<div>
          <dt>${icon('document', { size: 20 })}<span>Email</span></dt>
          <dd><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></dd>
        </div>`
            : ''
        }
        ${
          site.hours
            ? `<div>
          <dt>${icon('ledger', { size: 20 })}<span>Office hours</span></dt>
          <dd>${esc(site.hours)}</dd>
        </div>`
            : ''
        }
      </dl>

      <div class="map" data-map>
        <div class="map__placeholder">
          <button class="btn btn--secondary btn--small" type="button" data-map-load data-map-src="https://www.google.com/maps?q=${mapQuery}&amp;output=embed" data-map-title="Map showing the office location">Show map</button>
          <p class="map__note">The map is provided by Google Maps and loads only when you select “Show map”.</p>
        </div>
      </div>
    </div>

    <div class="contact-form-wrap">
      <h2 class="contact-details__title">Send a message</h2>
      ${
        active
          ? ''
          : `<div class="notice" role="note">
        <p><strong>The online form is not yet active.</strong>${esc(callText)}</p>
      </div>`
      }
      <form class="form" ${active ? `action="https://formspree.io/f/${esc(formId)}"` : ''} method="post" data-contact-form data-active="${active}" data-error-message="Your message could not be sent.${esc(callText)}"${active ? '' : ' aria-describedby="form-inactive"'}>
        <fieldset ${active ? '' : 'disabled'}>
          <legend class="visually-hidden">Contact form</legend>
          <div class="form__row">
            <div class="field">
              <label for="cf-name">Full name</label>
              <input id="cf-name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="field">
              <label for="cf-email">Email</label>
              <input id="cf-email" name="email" type="email" autocomplete="email" required>
            </div>
          </div>
          <div class="form__row">
            <div class="field">
              <label for="cf-phone">Telephone <span class="field__optional">(optional)</span></label>
              <input id="cf-phone" name="phone" type="tel" autocomplete="tel">
            </div>
            <div class="field">
              <label for="cf-topic">Practice area</label>
              <select id="cf-topic" name="practice_area">
                <option value="">Select one</option>
                ${each(practiceAreas, (area) => `<option>${esc(area.title)}</option>`)}
                <option>Other</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="cf-message">Message</label>
            <textarea id="cf-message" name="message" rows="6" required aria-describedby="cf-message-hint"></textarea>
            <p class="field__hint" id="cf-message-hint">Do not include confidential, secret, or sensitive information.</p>
          </div>
          <div class="field field--check">
            <input id="cf-ack" name="acknowledgement" type="checkbox" value="yes" required>
            <label for="cf-ack">I understand that submitting a message through this form does not create an attorney-client relationship with ${esc(site.firmName)}.</label>
          </div>
          <input class="visually-hidden" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="btn btn--primary" type="submit">Send message</button>
          <p class="form__status" data-form-status role="status" aria-live="polite"></p>
        </fieldset>
        ${active ? '' : `<p class="visually-hidden" id="form-inactive">This form is not yet active and cannot be submitted.</p>`}
      </form>
      <div class="confidentiality">
        <h3>Confidentiality Notice</h3>
        <p>Do not send any confidential, secret, or sensitive information through this website or via email until a formal, written attorney-client engagement agreement has been signed. Unsolicited emails and data do not receive privileged or confidential treatment.</p>
        <p><a class="text-link" href="${root}disclaimers/">Read the full disclaimers and notices</a></p>
      </div>
    </div>
  </div>
</section>
`;
  },
};
