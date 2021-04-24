import { generateKeyPairSync } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

const genKeyPair = () => {
	const keyPair = generateKeyPairSync('rsa', {
		modulusLength: 4096, // bits - standard for RSA keys
		publicKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem', // Most common formatting choice
		},
		privateKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem', // Most common formatting choice
		},
	})

	fs.writeFileSync(path.join(__dirname, '../../', 'id_rsa_pub_key.pem'), keyPair.publicKey)
	fs.writeFileSync(path.join(__dirname, '../../', 'id_rsa_priv_key.pem'), keyPair.privateKey)
}

export default genKeyPair
