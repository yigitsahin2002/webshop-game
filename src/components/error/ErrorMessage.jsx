function parseErrorCode(code) {
    if (code === 'VALIDATION_FAILED') return 'Validatie mislukt';
    if (code === 'UNAUTHORIZED') return 'Niet geautoriseerd';
    if (code === 'FORBIDDEN') return 'Geen toegang';
  
    return 'Onbekende fout';
  }
  
  function parseError(error) {
    let title;
  
    if (typeof error === 'object' && error.response?.data) {
      title = parseErrorCode(error.response.data.code);
      if (title === 'Niet geautoriseerd' || title === 'Onbekende fout' || title === 'Geen toegang') {
        title += `. Er is waarschijnlijk een onbekende fout opgetreden of je sessie is beëindigd. Klik op de knop om uitgelogd te worden.`;
      } else {
        title +=  `. Klik op de knop om verder te doen.`;
      }
    }
  
    return {
      title: title || 'Onbekende fout',
      
    };
  }
  
  export default function ErrorMessage({ error }) {
    if (!error) return null;
    
    const { title } = parseError(error);
    return (
      <>
      <p data-cy="error_message">
        {title}
      </p>
      </>
    );
  }