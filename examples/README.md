# BeeGone examples

Generic fragments. Adjust field names, API URL, and downstream steps for your project.

| File | Demonstrates |
|------|----------------|
| [contact-form-validate.json](contact-form-validate.json) | POST API: BeeGone Validate → Condition on `{{beegone.passed}}` (fake success for bots in `else`) |
| [contact-form-snippet.html](contact-form-snippet.html) | Form with `dmx-beegone-honeypot` inside the `<form>` |

**Field names must match:** if the component uses `field-name="beegone_contact"`, bind `{{$_POST.beegone_contact}}` on the validate step.

After adding the API steps in Wappler, run once and save so step `meta` refreshes for App Connect.
